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
        category: AgentCategory,
        api_endpoint: String,
        capabilities: Vec<String>,
        queries_per_key: u32,
        bonus_tiers: Vec<BonusTier>,
        github_url: Option<String>,
        twitter_handle: Option<String>,
        webhook_url: Option<String>,
    ) -> Result<()> {
        require!(name.len() <= 32, ErrorCode::NameTooLong);
        require!(symbol.len() <= 10, ErrorCode::SymbolTooLong);
        require!(api_endpoint.len() <= 256, ErrorCode::ApiEndpointTooLong);
        require!(!capabilities.is_empty(), ErrorCode::NoCapabilities);
        require!(capabilities.len() <= 10, ErrorCode::TooManyCapabilities);
        require!(queries_per_key > 0, ErrorCode::InvalidQueryRate);
        require!(bonus_tiers.len() <= 5, ErrorCode::TooManyTiers);
        
        let agent = &mut ctx.accounts.agent;
        let creator = &ctx.accounts.creator;
        
        agent.creator = creator.key();
        agent.name = name;
        agent.symbol = symbol;
        agent.description = description;
        agent.category = category;
        agent.api_endpoint = api_endpoint;
        agent.capabilities = capabilities;
        agent.queries_per_key = queries_per_key;
        agent.bonus_tiers = bonus_tiers;
        agent.github_url = github_url;
        agent.twitter_handle = twitter_handle;
        agent.webhook_url = webhook_url;
        agent.created_at = Clock::get()?.unix_timestamp;
        agent.total_keys = 0;
        agent.holders = 0;
        agent.total_api_calls = 0;
        agent.bump = ctx.bumps.agent;
        
        // Initialize agent fees account
        let agent_fees = &mut ctx.accounts.agent_fees;
        agent_fees.agent = agent.key();
        agent_fees.creator = creator.key();
        agent_fees.total_fees = 0;
        agent_fees.claimable_fees = 0;
        
        msg!("Agent created: {}", agent.key());
        msg!("API Endpoint: {}", agent.api_endpoint);
        msg!("Queries per key: {}", agent.queries_per_key);
        msg!("Bonus tiers: {:?}", agent.bonus_tiers);
        
        Ok(())
    }

    pub fn buy_keys(
        ctx: Context<BuyKeys>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(amount <= 1000, ErrorCode::MaxKeysExceeded);
        
        let agent = &ctx.accounts.agent;
        let buyer = &ctx.accounts.buyer;
        
        // Calculate price using bonding curve
        let total_cost = get_buy_price(agent.total_keys, amount);
        let total_fee = total_cost * 3 / 100;  // 3% total fee
        let creator_fee = total_cost * 2 / 100;  // 2% to creator
        let protocol_fee = total_cost * 1 / 100;  // 1% to protocol
        let creator_payment = total_cost - total_fee;
        
        // Transfer payment to creator
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
        
        // Update creator fees
        let agent_fees = &mut ctx.accounts.agent_fees;
        agent_fees.total_fees = agent_fees.total_fees.checked_add(creator_fee).unwrap();
        agent_fees.claimable_fees = agent_fees.claimable_fees.checked_add(creator_fee).unwrap();
        
        // Transfer protocol fee to treasury
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
        
        // Mint key tokens to buyer
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
                    to: ctx.accounts.buyer_key_account.to_account_info(),
                    authority: ctx.accounts.agent.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        
        // Update agent stats
        let agent = &mut ctx.accounts.agent;
        agent.total_keys = agent.total_keys.checked_add(amount).unwrap();
        agent.holders = agent.holders.checked_add(1).unwrap();
        
        // Calculate quota for event
        let quota = calculate_quota(amount, agent);
        
        // Emit event for API gateway
        emit!(KeyPurchased {
            agent: agent.key(),
            buyer: buyer.key(),
            amount,
            total_cost,
            daily_quota: quota,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        msg!("Keys purchased: {} keys for {} lamports", amount, total_cost);
        msg!("Daily API quota: {} queries", quota);
        
        Ok(())
    }

    pub fn sell_keys(
        ctx: Context<SellKeys>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        let agent = &ctx.accounts.agent;
        let seller = &ctx.accounts.seller;
        
        // Calculate sell price (95% of buy price)
        let sell_price = get_sell_price(agent.total_keys, amount);
        
        // Burn keys from seller
        token::burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Burn {
                    mint: ctx.accounts.key_mint.to_account_info(),
                    from: ctx.accounts.seller_key_account.to_account_info(),
                    authority: seller.to_account_info(),
                },
            ),
            amount,
        )?;
        
        // Transfer SOL to seller from agent treasury
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.agent.to_account_info().key(),
                seller.key,
                sell_price,
            ),
            &[
                ctx.accounts.agent.to_account_info(),
                seller.to_account_info(),
            ],
        )?;
        
        // Update agent stats
        let agent = &mut ctx.accounts.agent;
        agent.total_keys = agent.total_keys.checked_sub(amount).unwrap();
        
        // Emit event
        emit!(KeySold {
            agent: agent.key(),
            seller: seller.key(),
            amount,
            sell_price,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        msg!("Keys sold: {} keys for {} lamports", amount, sell_price);
        
        Ok(())
    }

    pub fn claim_creator_fees(ctx: Context<ClaimCreatorFees>) -> Result<()> {
        let agent_fees = &mut ctx.accounts.agent_fees;
        let creator = &ctx.accounts.creator;
        
        require!(agent_fees.claimable_fees > 0, ErrorCode::NoFeesToClaim);
        
        let claimable = agent_fees.claimable_fees;
        agent_fees.claimable_fees = 0;
        
        // Transfer fees to creator
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.agent.to_account_info().key(),
                creator.key,
                claimable,
            ),
            &[
                ctx.accounts.agent.to_account_info(),
                creator.to_account_info(),
            ],
        )?;
        
        emit!(FeesClaimed {
            agent: ctx.accounts.agent.key(),
            creator: creator.key(),
            amount: claimable,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        msg!("Fees claimed: {} lamports", claimable);
        
        Ok(())
    }

    pub fn update_agent_stats(
        ctx: Context<UpdateAgentStats>,
        calls_made: u64,
    ) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        
        // Only authorized oracle/gateway can update
        require!(
            ctx.accounts.authority.key() == agent.creator || 
            ctx.accounts.authority.key() == ctx.accounts.treasury.key(),
            ErrorCode::Unauthorized
        );
        
        agent.total_api_calls = agent.total_api_calls.checked_add(calls_made).unwrap();
        
        emit!(StatsUpdated {
            agent: agent.key(),
            calls_made,
            total_calls: agent.total_api_calls,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
}

// Bonding curve functions
fn get_buy_price(current_supply: u64, amount: u64) -> u64 {
    // Linear bonding curve
    let base_price = 10_000_000u64; // 0.01 SOL
    let slope = 1_000u64; // Price increases per key
    
    let start_price = base_price + (current_supply * slope);
    let end_price = base_price + ((current_supply + amount) * slope);
    
    ((start_price + end_price) / 2) * amount
}

fn get_sell_price(current_supply: u64, amount: u64) -> u64 {
    let buy_price = get_buy_price(current_supply.saturating_sub(amount), amount);
    buy_price * 95 / 100 // 5% spread
}

// Calculate daily quota based on keys held with bonus
fn calculate_quota(keys_held: u64, agent: &Agent) -> u64 {
    let base_quota = keys_held * agent.queries_per_key as u64;
    
    // Find highest applicable bonus tier
    let bonus = agent.bonus_tiers
        .iter()
        .filter(|t| keys_held >= t.min_keys as u64)
        .max_by_key(|t| t.bonus_percent)
        .map(|t| t.bonus_percent)
        .unwrap_or(0);
    
    base_quota * (100 + bonus as u64) / 100
}

// Account structures
#[derive(Accounts)]
pub struct CreateAgent<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + Agent::MAX_SIZE,
        seeds = [b"agent", creator.key().as_ref()],
        bump
    )]
    pub agent: Account<'info, Agent>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + AgentFees::MAX_SIZE,
        seeds = [b"agent_fees", agent.key().as_ref()],
        bump
    )]
    pub agent_fees: Account<'info, AgentFees>,
    
    #[account(
        init,
        payer = creator,
        mint::decimals = 0,
        mint::authority = agent,
        seeds = [b"key_mint", agent.key().as_ref()],
        bump
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
    
    /// CHECK: Creator account
    #[account(mut, address = agent.creator)]
    pub creator: AccountInfo<'info>,
    
    #[account(
        mut,
        seeds = [b"agent_fees", agent.key().as_ref()],
        bump
    )]
    pub agent_fees: Account<'info, AgentFees>,
    
    /// CHECK: Treasury account
    #[account(mut, address = crate::TREASURY_ADDRESS)]
    pub treasury: AccountInfo<'info>,
    
    #[account(
        mut,
        seeds = [b"key_mint", agent.key().as_ref()],
        bump
    )]
    pub key_mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = key_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_key_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SellKeys<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    
    #[account(mut)]
    pub agent: Account<'info, Agent>,
    
    #[account(
        mut,
        seeds = [b"key_mint", agent.key().as_ref()],
        bump
    )]
    pub key_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = key_mint,
        associated_token::authority = seller,
    )]
    pub seller_key_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimCreatorFees<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(mut)]
    pub agent: Account<'info, Agent>,
    
    #[account(
        mut,
        seeds = [b"agent_fees", agent.key().as_ref()],
        bump,
        has_one = creator,
        has_one = agent
    )]
    pub agent_fees: Account<'info, AgentFees>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgentStats<'info> {
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub agent: Account<'info, Agent>,
    
    /// CHECK: Treasury for authorization
    #[account(address = crate::TREASURY_ADDRESS)]
    pub treasury: AccountInfo<'info>,
}

// Data structures
#[account]
pub struct Agent {
    pub creator: Pubkey,
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub category: AgentCategory,
    pub api_endpoint: String,
    pub capabilities: Vec<String>,
    pub queries_per_key: u32,
    pub bonus_tiers: Vec<BonusTier>,
    pub github_url: Option<String>,
    pub twitter_handle: Option<String>,
    pub webhook_url: Option<String>,
    pub created_at: i64,
    pub total_keys: u64,
    pub holders: u64,
    pub total_api_calls: u64,
    pub bump: u8,
}

impl Agent {
    pub const MAX_SIZE: usize = 32 + 32 + 10 + 200 + 1 + 256 + 4 + (10 * 50) + 4 + (5 * 8) + 1 + 100 + 1 + 50 + 1 + 256 + 8 + 8 + 8 + 8 + 1;
}

#[account]
pub struct AgentFees {
    pub agent: Pubkey,
    pub creator: Pubkey,
    pub total_fees: u64,
    pub claimable_fees: u64,
}

impl AgentFees {
    pub const MAX_SIZE: usize = 32 + 32 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AgentCategory {
    Research,
    Trading,
    Marketing,
    Security,
    DeveloperTools,
    Content,
    Data,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct BonusTier {
    pub min_keys: u32,
    pub bonus_percent: u32,
}

// Events
#[event]
pub struct KeyPurchased {
    pub agent: Pubkey,
    pub buyer: Pubkey,
    pub amount: u64,
    pub total_cost: u64,
    pub daily_quota: u64,
    pub timestamp: i64,
}

#[event]
pub struct KeySold {
    pub agent: Pubkey,
    pub seller: Pubkey,
    pub amount: u64,
    pub sell_price: u64,
    pub timestamp: i64,
}

#[event]
pub struct FeesClaimed {
    pub agent: Pubkey,
    pub creator: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct StatsUpdated {
    pub agent: Pubkey,
    pub calls_made: u64,
    pub total_calls: u64,
    pub timestamp: i64,
}

pub const TREASURY_ADDRESS: Pubkey = Pubkey::new_from_array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

#[error_code]
pub enum ErrorCode {
    #[msg("Name too long")]
    NameTooLong,
    #[msg("Symbol too long")]
    SymbolTooLong,
    #[msg("API endpoint too long")]
    ApiEndpointTooLong,
    #[msg("No capabilities specified")]
    NoCapabilities,
    #[msg("Too many capabilities")]
    TooManyCapabilities,
    #[msg("Invalid query rate")]
    InvalidQueryRate,
    #[msg("Too many bonus tiers")]
    TooManyTiers,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Max keys exceeded")]
    MaxKeysExceeded,
    #[msg("No fees to claim")]
    NoFeesToClaim,
    #[msg("Unauthorized")]
    Unauthorized,
}
