use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod agentkeys {
    use super::*;

    pub fn create_agent(
        ctx: Context<CreateAgent>,
        name: String,
        symbol: String,
        description: String,
    ) -> Result<()> {
        require!(name.len() <= 32, ErrorCode::NameTooLong);
        require!(symbol.len() <= 10, ErrorCode::SymbolTooLong);
        
        let agent = &mut ctx.accounts.agent;
        let creator = &ctx.accounts.creator;
        
        agent.creator = creator.key();
        agent.name = name;
        agent.symbol = symbol;
        agent.description = description;
        agent.created_at = Clock::get()?.unix_timestamp;
        agent.total_keys = 0;
        agent.holders = 0;
        agent.bump = ctx.bumps.agent;
        
        msg!("Agent created: {}", agent.key());
        Ok(())
    }

    pub fn buy_keys(
        ctx: Context<BuyKeys>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        let agent = &ctx.accounts.agent;
        let buyer = &ctx.accounts.buyer;
        
        let price_per_key = calculate_price(agent.total_keys);
        let total_cost = price_per_key.checked_mul(amount).unwrap();
        let protocol_fee = total_cost / 20;
        let creator_payment = total_cost - protocol_fee;
        
        invoke(
            &system_instruction::transfer(
                buyer.key,
                &agent.creator,
                creator_payment,
            ),
            &[
                buyer.to_account_info(),
                ctx.accounts.creator.to_account_info(),
            ],
        )?;
        
        invoke(
            &system_instruction::transfer(
                buyer.key,
                &ctx.accounts.treasury.key(),
                protocol_fee,
            ),
            &[
                buyer.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
            ],
        )?;
        
        let seeds = &[
            b"agent",
            agent.creator.as_ref(),
            &[agent.bump],
        ];
        let signer = &[&seeds[..]];
        
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.key_mint.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.agent.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        
        let agent = &mut ctx.accounts.agent;
        agent.total_keys = agent.total_keys.checked_add(amount).unwrap();
        
        msg!("Bought {} keys for {} lamports", amount, total_cost);
        Ok(())
    }

    pub fn sell_keys(
        ctx: Context<SellKeys>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        let agent = &ctx.accounts.agent;
        let seller = &ctx.accounts.seller;
        
        require!(
            ctx.accounts.seller_token_account.amount >= amount,
            ErrorCode::InsufficientKeys
        );
        
        let price_per_key = calculate_price(agent.total_keys - amount);
        let total_proceeds = price_per_key.checked_mul(amount).unwrap();
        let protocol_fee = total_proceeds / 20;
        let net_proceeds = total_proceeds - protocol_fee;
        
        let seeds = &[
            b"agent",
            agent.creator.as_ref(),
            &[agent.bump],
        ];
        let signer = &[&seeds[..]];
        
        token::burn(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Burn {
                    mint: ctx.accounts.key_mint.to_account_info(),
                    from: ctx.accounts.seller_token_account.to_account_info(),
                    authority: ctx.accounts.agent.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.creator.key(),
                seller.key,
                net_proceeds,
            ),
            &[
                ctx.accounts.creator.to_account_info(),
                seller.to_account_info(),
            ],
        )?;
        
        let agent = &mut ctx.accounts.agent;
        agent.total_keys = agent.total_keys.checked_sub(amount).unwrap();
        
        msg!("Sold {} keys for {} lamports", amount, net_proceeds);
        Ok(())
    }

    pub fn add_resource(
        ctx: Context<AddResource>,
        name: String,
        description: String,
        keys_required: u64,
        resource_type: ResourceType,
        encrypted_url: String,
    ) -> Result<()> {
        let agent = &ctx.accounts.agent;
        let creator = &ctx.accounts.creator;
        
        require!(
            agent.creator == creator.key(),
            ErrorCode::Unauthorized
        );
        
        let resource = &mut ctx.accounts.resource;
        resource.agent = agent.key();
        resource.name = name;
        resource.description = description;
        resource.keys_required = keys_required;
        resource.resource_type = resource_type;
        resource.encrypted_url = encrypted_url;
        resource.created_at = Clock::get()?.unix_timestamp;
        
        msg!("Resource added: {}", resource.key());
        Ok(())
    }
}

fn calculate_price(supply: u64) -> u64 {
    let base = supply / 100;
    base.saturating_mul(base).saturating_mul(100_000)
}

#[account]
pub struct Agent {
    pub creator: Pubkey,
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub created_at: i64,
    pub total_keys: u64,
    pub holders: u64,
    pub bump: u8,
}

#[account]
pub struct Resource {
    pub agent: Pubkey,
    pub name: String,
    pub description: String,
    pub keys_required: u64,
    pub resource_type: ResourceType,
    pub encrypted_url: String,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub enum ResourceType {
    PromptPack,
    TrainingData,
    CodeModule,
    FullSource,
    Subscription,
}

#[derive(Accounts)]
pub struct CreateAgent<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + 300,
        seeds = [b"agent", creator.key().as_ref()],
        bump
    )]
    pub agent: Account<'info, Agent>,

    #[account(
        init,
        payer = creator,
        mint::decimals = 0,
        mint::authority = agent,
    )]
    pub key_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyKeys<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub agent: Account<'info, Agent>,

    /// CHECK: This is the agent creator who receives payment
    #[account(mut, address = agent.creator)]
    pub creator: AccountInfo<'info>,

    /// CHECK: Treasury account for protocol fees
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    #[account(mut)]
    pub key_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = buyer,
        associated_token::mint = key_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SellKeys<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(mut)]
    pub agent: Account<'info, Agent>,

    /// CHECK: This is the agent creator who pays out
    #[account(mut, address = agent.creator)]
    pub creator: AccountInfo<'info>,

    #[account(mut)]
    pub key_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = key_mint,
        associated_token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddResource<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(mut)]
    pub agent: Account<'info, Agent>,

    #[account(
        init,
        payer = creator,
        space = 8 + 500,
        seeds = [b"resource", agent.key().as_ref(), &agent.total_keys.to_le_bytes()],
        bump
    )]
    pub resource: Account<'info, Resource>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Name too long (max 32 characters)")]
    NameTooLong,
    #[msg("Symbol too long (max 10 characters)")]
    SymbolTooLong,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient keys")]
    InsufficientKeys,
    #[msg("Unauthorized")]
    Unauthorized,
}
