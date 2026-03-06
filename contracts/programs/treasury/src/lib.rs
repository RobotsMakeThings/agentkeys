use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("TreasuryProgramId1111111111111111111111111");

#[program]
pub mod treasury {
    use super::*;

    /// Initialize the global treasury
    pub fn initialize_treasury(
        ctx: Context<InitializeTreasury>,
        protocol_fee_bps: u16, // Basis points (e.g., 100 = 1%)
        creator_fee_bps: u16,  // Basis points (e.g., 200 = 2%)
    ) -> Result<()> {
        require!(
            protocol_fee_bps + creator_fee_bps <= 1000, // Max 10% total fees
            TreasuryError::FeesTooHigh
        );
        
        let treasury = &mut ctx.accounts.treasury;
        treasury.authority = ctx.accounts.authority.key();
        treasury.protocol_fee_bps = protocol_fee_bps;
        treasury.creator_fee_bps = creator_fee_bps;
        treasury.total_protocol_fees = 0;
        treasury.total_creator_fees = 0;
        treasury.bump = ctx.bumps.treasury;
        
        emit!(TreasuryInitialized {
            treasury: treasury.key(),
            authority: treasury.authority,
            protocol_fee_bps,
            creator_fee_bps,
        });
        
        Ok(())
    }

    /// Collect fees from a transaction
    pub fn collect_fees(
        ctx: Context<CollectFees>,
        transaction_amount: u64,
        agent_creator: Pubkey,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        
        let protocol_fee = (transaction_amount as u128 * treasury.protocol_fee_bps as u128 / 10000) as u64;
        let creator_fee = (transaction_amount as u128 * treasury.creator_fee_bps as u128 / 10000) as u64;
        
        // Transfer protocol fee to treasury vault
        anchor_lang::solana_program::program::invoke(
            &anchor_lang::solana_program::system_instruction::transfer(
                ctx.accounts.payer.key,
                &ctx.accounts.protocol_vault.key(),
                protocol_fee,
            ),
            &[
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.protocol_vault.to_account_info(),
            ],
        )?;
        
        // Create or update creator fee account
        let creator_fees = &mut ctx.accounts.creator_fees;
        if creator_fees.creator == Pubkey::default() {
            creator_fees.creator = agent_creator;
            creator_fees.total_fees = 0;
            creator_fees.claimable_fees = 0;
            creator_fees.last_claimed = 0;
        }
        
        // Transfer creator fee to creator fee vault
        anchor_lang::solana_program::program::invoke(
            &anchor_lang::solana_program::system_instruction::transfer(
                ctx.accounts.payer.key,
                &ctx.accounts.creator_vault.key(),
                creator_fee,
            ),
            &[
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.creator_vault.to_account_info(),
            ],
        )?;
        
        // Update treasury state
        treasury.total_protocol_fees += protocol_fee;
        treasury.total_creator_fees += creator_fee;
        
        // Update creator fees
        creator_fees.total_fees += creator_fee;
        creator_fees.claimable_fees += creator_fee;
        
        emit!(FeesCollected {
            treasury: treasury.key(),
            agent_creator,
            protocol_fee,
            creator_fee,
            transaction_amount,
        });
        
        Ok(())
    }

    /// Claim creator fees
    pub fn claim_creator_fees(ctx: Context<ClaimCreatorFees>) -> Result<()> {
        let creator_fees = &mut ctx.accounts.creator_fees;
        
        require!(
            creator_fees.claimable_fees > 0,
            TreasuryError::NoFeesToClaim
        );
        
        // Minimum claim: $5 worth (0.03 SOL at $150/SOL)
        let min_claim = 30_000_000; // 0.03 SOL in lamports
        require!(
            creator_fees.claimable_fees >= min_claim,
            TreasuryError::ClaimTooSmall
        );
        
        let claim_amount = creator_fees.claimable_fees;
        
        // Transfer fees from vault to creator
        **ctx.accounts.creator_vault.to_account_info().try_borrow_mut_lamports()? -= claim_amount;
        **ctx.accounts.creator.to_account_info().try_borrow_mut_lamports()? += claim_amount;
        
        // Update creator fees state
        creator_fees.claimable_fees = 0;
        creator_fees.last_claimed = Clock::get()?.unix_timestamp;
        
        emit!(CreatorFeesClaimed {
            creator: ctx.accounts.creator.key(),
            amount: claim_amount,
            timestamp: creator_fees.last_claimed,
        });
        
        Ok(())
    }

    /// Withdraw protocol fees (admin only)
    pub fn withdraw_protocol_fees(
        ctx: Context<WithdrawProtocolFees>,
        amount: u64,
    ) -> Result<()> {
        let treasury = &ctx.accounts.treasury;
        
        require!(
            ctx.accounts.authority.key() == treasury.authority,
            TreasuryError::Unauthorized
        );
        
        require!(
            **ctx.accounts.protocol_vault.to_account_info().lamports.borrow() >= amount,
            TreasuryError::InsufficientFunds
        );
        
        // Transfer from protocol vault to authority
        **ctx.accounts.protocol_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.authority.to_account_info().try_borrow_mut_lamports()? += amount;
        
        emit!(ProtocolFeesWithdrawn {
            authority: ctx.accounts.authority.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Update fee structure (admin only)
    pub fn update_fees(
        ctx: Context<UpdateFees>,
        new_protocol_fee_bps: u16,
        new_creator_fee_bps: u16,
    ) -> Result<()> {
        require!(
            new_protocol_fee_bps + new_creator_fee_bps <= 1000,
            TreasuryError::FeesTooHigh
        );
        
        let treasury = &mut ctx.accounts.treasury;
        let old_protocol = treasury.protocol_fee_bps;
        let old_creator = treasury.creator_fee_bps;
        
        treasury.protocol_fee_bps = new_protocol_fee_bps;
        treasury.creator_fee_bps = new_creator_fee_bps;
        
        emit!(FeesUpdated {
            treasury: treasury.key(),
            old_protocol_fee_bps: old_protocol,
            old_creator_fee_bps: old_creator,
            new_protocol_fee_bps,
            new_creator_fee_bps,
        });
        
        Ok(())
    }

    /// Create reward distribution for top agents
    pub fn distribute_rewards(
        ctx: Context<DistributeRewards>,
        reward_amount: u64,
        recipients: Vec<Pubkey>,
    ) -> Result<()> {
        require!(recipients.len() <= 10, TreasuryError::TooManyRecipients);
        require!(recipients.len() > 0, TreasuryError::NoRecipients);
        
        let per_recipient = reward_amount / recipients.len() as u64;
        
        for recipient in recipients.iter() {
            // Transfer reward to recipient
            **ctx.accounts.protocol_vault.to_account_info().try_borrow_mut_lamports()? -= per_recipient;
            // Note: In a real implementation, you'd need to pass recipient accounts
            // This is simplified for the example
        }
        
        emit!(RewardsDistributed {
            total_amount: reward_amount,
            per_recipient,
            recipient_count: recipients.len() as u8,
        });
        
        Ok(())
    }
}

#[account]
pub struct Treasury {
    pub authority: Pubkey,
    pub protocol_fee_bps: u16,
    pub creator_fee_bps: u16,
    pub total_protocol_fees: u64,
    pub total_creator_fees: u64,
    pub bump: u8,
}

#[account]
pub struct CreatorFees {
    pub creator: Pubkey,
    pub total_fees: u64,
    pub claimable_fees: u64,
    pub last_claimed: i64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct InitializeTreasury<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 2 + 2 + 8 + 8 + 1,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    /// CHECK: Protocol fee vault
    #[account(
        init,
        payer = authority,
        space = 0,
        seeds = [b"protocol_vault"],
        bump
    )]
    pub protocol_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(agent_creator: Pubkey)]
pub struct CollectFees<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(mut)]
    pub treasury: Account<'info, Treasury>,
    
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + 32 + 8 + 8 + 8 + 1,
        seeds = [b"creator_fees", agent_creator.as_ref()],
        bump
    )]
    pub creator_fees: Account<'info, CreatorFees>,
    
    /// CHECK: Protocol vault
    #[account(
        mut,
        seeds = [b"protocol_vault"],
        bump
    )]
    pub protocol_vault: AccountInfo<'info>,
    
    /// CHECK: Creator vault
    #[account(
        init_if_needed,
        payer = payer,
        space = 0,
        seeds = [b"creator_vault", agent_creator.as_ref()],
        bump
    )]
    pub creator_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimCreatorFees<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        mut,
        has_one = creator,
        seeds = [b"creator_fees", creator.key().as_ref()],
        bump
    )]
    pub creator_fees: Account<'info, CreatorFees>,
    
    /// CHECK: Creator vault
    #[account(
        mut,
        seeds = [b"creator_vault", creator.key().as_ref()],
        bump
    )]
    pub creator_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawProtocolFees<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        has_one = authority,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    /// CHECK: Protocol vault
    #[account(
        mut,
        seeds = [b"protocol_vault"],
        bump
    )]
    pub protocol_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateFees<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        has_one = authority,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, Treasury>,
}

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        has_one = authority,
        seeds = [b"treasury"],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    /// CHECK: Protocol vault
    #[account(
        mut,
        seeds = [b"protocol_vault"],
        bump
    )]
    pub protocol_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[event]
pub struct TreasuryInitialized {
    pub treasury: Pubkey,
    pub authority: Pubkey,
    pub protocol_fee_bps: u16,
    pub creator_fee_bps: u16,
}

#[event]
pub struct FeesCollected {
    pub treasury: Pubkey,
    pub agent_creator: Pubkey,
    pub protocol_fee: u64,
    pub creator_fee: u64,
    pub transaction_amount: u64,
}

#[event]
pub struct CreatorFeesClaimed {
    pub creator: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct ProtocolFeesWithdrawn {
    pub authority: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct FeesUpdated {
    pub treasury: Pubkey,
    pub old_protocol_fee_bps: u16,
    pub old_creator_fee_bps: u16,
    pub new_protocol_fee_bps: u16,
    pub new_creator_fee_bps: u16,
}

#[event]
pub struct RewardsDistributed {
    pub total_amount: u64,
    pub per_recipient: u64,
    pub recipient_count: u8,
}

#[error_code]
pub enum TreasuryError {
    #[msg("Total fees cannot exceed 10%")]
    FeesTooHigh,
    #[msg("No fees available to claim")]
    NoFeesToClaim,
    #[msg("Claim amount too small (minimum $5)")]
    ClaimTooSmall,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Too many recipients (max 10)")]
    TooManyRecipients,
    #[msg("No recipients specified")]
    NoRecipients,
}