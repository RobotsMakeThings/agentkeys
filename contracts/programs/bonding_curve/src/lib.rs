use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("BondCurveProgramId1111111111111111111111111");

#[program]
pub mod bonding_curve {
    use super::*;

    /// Initialize a new bonding curve for an agent
    pub fn initialize_curve(
        ctx: Context<InitializeCurve>,
        initial_supply: u64,
        reserve_ratio: u16, // Basis points (e.g., 3000 = 30%)
        slope: u64,
        max_supply: u64,
    ) -> Result<()> {
        require!(reserve_ratio <= 10000, BondingCurveError::InvalidReserveRatio);
        require!(max_supply > initial_supply, BondingCurveError::InvalidMaxSupply);
        
        let curve = &mut ctx.accounts.bonding_curve;
        curve.agent = ctx.accounts.agent.key();
        curve.reserve_ratio = reserve_ratio;
        curve.slope = slope;
        curve.current_supply = initial_supply;
        curve.max_supply = max_supply;
        curve.reserve_balance = 0;
        curve.created_at = Clock::get()?.unix_timestamp;
        curve.bump = ctx.bumps.bonding_curve;
        
        emit!(CurveInitialized {
            curve: curve.key(),
            agent: curve.agent,
            initial_supply,
            reserve_ratio,
            slope,
            max_supply,
        });
        
        Ok(())
    }

    /// Calculate price for buying tokens (exponential curve)
    pub fn calculate_buy_price(
        ctx: Context<CalculatePrice>,
        amount: u64,
    ) -> Result<u64> {
        let curve = &ctx.accounts.bonding_curve;
        
        require!(
            curve.current_supply + amount <= curve.max_supply,
            BondingCurveError::ExceedsMaxSupply
        );
        
        let price = exponential_price_integral(
            curve.current_supply,
            curve.current_supply + amount,
            curve.slope,
        );
        
        msg!("Buy price for {} tokens: {} lamports", amount, price);
        Ok(price)
    }

    /// Calculate price for selling tokens
    pub fn calculate_sell_price(
        ctx: Context<CalculatePrice>,
        amount: u64,
    ) -> Result<u64> {
        let curve = &ctx.accounts.bonding_curve;
        
        require!(
            curve.current_supply >= amount,
            BondingCurveError::InsufficientSupply
        );
        
        let price = exponential_price_integral(
            curve.current_supply - amount,
            curve.current_supply,
            curve.slope,
        );
        
        msg!("Sell price for {} tokens: {} lamports", amount, price);
        Ok(price)
    }

    /// Execute token purchase through bonding curve
    pub fn buy_tokens(
        ctx: Context<BuyTokens>,
        amount: u64,
        max_price: u64,
    ) -> Result<()> {
        let curve = &mut ctx.accounts.bonding_curve;
        
        require!(
            curve.current_supply + amount <= curve.max_supply,
            BondingCurveError::ExceedsMaxSupply
        );
        
        let price = exponential_price_integral(
            curve.current_supply,
            curve.current_supply + amount,
            curve.slope,
        );
        
        require!(price <= max_price, BondingCurveError::PriceSlippage);
        
        // Transfer SOL to reserve
        anchor_lang::solana_program::program::invoke(
            &anchor_lang::solana_program::system_instruction::transfer(
                ctx.accounts.buyer.key,
                &ctx.accounts.reserve_account.key(),
                price,
            ),
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.reserve_account.to_account_info(),
            ],
        )?;
        
        // Mint tokens to buyer
        let seeds = &[
            b"bonding_curve",
            curve.agent.as_ref(),
            &[curve.bump],
        ];
        let signer = &[&seeds[..]];
        
        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.token_mint.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.bonding_curve.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        
        // Update curve state
        curve.current_supply += amount;
        curve.reserve_balance += price;
        
        emit!(TokensPurchased {
            curve: curve.key(),
            buyer: ctx.accounts.buyer.key(),
            amount,
            price,
            new_supply: curve.current_supply,
        });
        
        Ok(())
    }

    /// Execute token sale through bonding curve
    pub fn sell_tokens(
        ctx: Context<SellTokens>,
        amount: u64,
        min_price: u64,
    ) -> Result<()> {
        let curve = &mut ctx.accounts.bonding_curve;
        
        require!(
            curve.current_supply >= amount,
            BondingCurveError::InsufficientSupply
        );
        
        let price = exponential_price_integral(
            curve.current_supply - amount,
            curve.current_supply,
            curve.slope,
        );
        
        require!(price >= min_price, BondingCurveError::PriceSlippage);
        require!(curve.reserve_balance >= price, BondingCurveError::InsufficientReserve);
        
        // Burn tokens from seller
        let seeds = &[
            b"bonding_curve",
            curve.agent.as_ref(),
            &[curve.bump],
        ];
        let signer = &[&seeds[..]];
        
        token::burn(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Burn {
                    mint: ctx.accounts.token_mint.to_account_info(),
                    from: ctx.accounts.seller_token_account.to_account_info(),
                    authority: ctx.accounts.bonding_curve.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;
        
        // Transfer SOL from reserve to seller
        **ctx.accounts.reserve_account.to_account_info().try_borrow_mut_lamports()? -= price;
        **ctx.accounts.seller.to_account_info().try_borrow_mut_lamports()? += price;
        
        // Update curve state
        curve.current_supply -= amount;
        curve.reserve_balance -= price;
        
        emit!(TokensSold {
            curve: curve.key(),
            seller: ctx.accounts.seller.key(),
            amount,
            price,
            new_supply: curve.current_supply,
        });
        
        Ok(())
    }
}

/// Exponential bonding curve price calculation
/// Price = slope * (e^(supply/1000) - 1)
fn exponential_price_integral(from_supply: u64, to_supply: u64, slope: u64) -> u64 {
    if from_supply == to_supply {
        return 0;
    }
    
    // Simplified exponential calculation for demo
    // In production, use more sophisticated math libraries
    let avg_supply = (from_supply + to_supply) / 2;
    let base_price = slope * avg_supply / 1000; // Scale factor
    let quantity = to_supply - from_supply;
    
    // Apply exponential multiplier based on supply level
    let exp_multiplier = 1000 + (avg_supply * 2); // Simple exponential approximation
    (base_price * quantity * exp_multiplier) / 1000000 // Scale to lamports
}

#[account]
pub struct BondingCurve {
    pub agent: Pubkey,
    pub reserve_ratio: u16,
    pub slope: u64,
    pub current_supply: u64,
    pub max_supply: u64,
    pub reserve_balance: u64,
    pub created_at: i64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct InitializeCurve<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: Agent account reference
    pub agent: AccountInfo<'info>,
    
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 2 + 8 + 8 + 8 + 8 + 8 + 1, // Discriminator + fields
        seeds = [b"bonding_curve", agent.key().as_ref()],
        bump
    )]
    pub bonding_curve: Account<'info, BondingCurve>,
    
    /// CHECK: Reserve account to hold SOL
    #[account(
        init,
        payer = payer,
        space = 0,
        seeds = [b"reserve", bonding_curve.key().as_ref()],
        bump
    )]
    pub reserve_account: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CalculatePrice<'info> {
    pub bonding_curve: Account<'info, BondingCurve>,
}

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    #[account(mut)]
    pub bonding_curve: Account<'info, BondingCurve>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Reserve account
    #[account(
        mut,
        seeds = [b"reserve", bonding_curve.key().as_ref()],
        bump
    )]
    pub reserve_account: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SellTokens<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    
    #[account(mut)]
    pub bonding_curve: Account<'info, BondingCurve>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Reserve account
    #[account(
        mut,
        seeds = [b"reserve", bonding_curve.key().as_ref()],
        bump
    )]
    pub reserve_account: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[event]
pub struct CurveInitialized {
    pub curve: Pubkey,
    pub agent: Pubkey,
    pub initial_supply: u64,
    pub reserve_ratio: u16,
    pub slope: u64,
    pub max_supply: u64,
}

#[event]
pub struct TokensPurchased {
    pub curve: Pubkey,
    pub buyer: Pubkey,
    pub amount: u64,
    pub price: u64,
    pub new_supply: u64,
}

#[event]
pub struct TokensSold {
    pub curve: Pubkey,
    pub seller: Pubkey,
    pub amount: u64,
    pub price: u64,
    pub new_supply: u64,
}

#[error_code]
pub enum BondingCurveError {
    #[msg("Invalid reserve ratio (must be <= 10000)")]
    InvalidReserveRatio,
    #[msg("Invalid max supply")]
    InvalidMaxSupply,
    #[msg("Exceeds maximum supply")]
    ExceedsMaxSupply,
    #[msg("Insufficient supply for sale")]
    InsufficientSupply,
    #[msg("Price slippage exceeded")]
    PriceSlippage,
    #[msg("Insufficient reserve balance")]
    InsufficientReserve,
}