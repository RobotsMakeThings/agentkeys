use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("AccessControlProgramId1111111111111111111111");

#[program]
pub mod access_control {
    use super::*;

    /// Create an access rule for a resource
    pub fn create_access_rule(
        ctx: Context<CreateAccessRule>,
        resource_id: String,
        min_tokens_required: u64,
        access_type: AccessType,
        expiry_duration: Option<i64>, // Seconds
    ) -> Result<()> {
        require!(resource_id.len() <= 64, AccessError::ResourceIdTooLong);
        
        let access_rule = &mut ctx.accounts.access_rule;
        access_rule.agent = ctx.accounts.agent.key();
        access_rule.creator = ctx.accounts.creator.key();
        access_rule.resource_id = resource_id;
        access_rule.min_tokens_required = min_tokens_required;
        access_rule.access_type = access_type;
        access_rule.expiry_duration = expiry_duration;
        access_rule.created_at = Clock::get()?.unix_timestamp;
        access_rule.is_active = true;
        access_rule.total_accesses = 0;
        access_rule.bump = ctx.bumps.access_rule;
        
        emit!(AccessRuleCreated {
            rule: access_rule.key(),
            agent: access_rule.agent,
            resource_id: access_rule.resource_id.clone(),
            min_tokens_required,
            access_type,
        });
        
        Ok(())
    }

    /// Grant access to a user
    pub fn grant_access(
        ctx: Context<GrantAccess>,
        duration_hours: Option<u32>,
    ) -> Result<()> {
        let access_rule = &ctx.accounts.access_rule;
        let user_token_account = &ctx.accounts.user_token_account;
        
        require!(access_rule.is_active, AccessError::AccessRuleInactive);
        
        // Verify user has enough tokens
        require!(
            user_token_account.amount >= access_rule.min_tokens_required,
            AccessError::InsufficientTokens
        );
        
        // Calculate expiry
        let current_time = Clock::get()?.unix_timestamp;
        let expires_at = if let Some(hours) = duration_hours {
            Some(current_time + (hours as i64 * 3600))
        } else {
            access_rule.expiry_duration.map(|duration| current_time + duration)
        };
        
        let access_grant = &mut ctx.accounts.access_grant;
        access_grant.access_rule = access_rule.key();
        access_grant.user = ctx.accounts.user.key();
        access_grant.granted_at = current_time;
        access_grant.expires_at = expires_at;
        access_grant.is_active = true;
        access_grant.access_count = 0;
        access_grant.last_accessed = None;
        access_grant.bump = ctx.bumps.access_grant;
        
        // Update access rule stats
        let access_rule_mut = &mut ctx.accounts.access_rule;
        access_rule_mut.total_accesses += 1;
        
        emit!(AccessGranted {
            grant: access_grant.key(),
            rule: access_rule.key(),
            user: ctx.accounts.user.key(),
            granted_at: current_time,
            expires_at,
        });
        
        Ok(())
    }

    /// Verify user access
    pub fn verify_access(ctx: Context<VerifyAccess>) -> Result<bool> {
        let access_grant = &ctx.accounts.access_grant;
        let access_rule = &ctx.accounts.access_rule;
        
        require!(access_rule.is_active, AccessError::AccessRuleInactive);
        require!(access_grant.is_active, AccessError::AccessGrantInactive);
        
        let current_time = Clock::get()?.unix_timestamp;
        
        // Check if access has expired
        if let Some(expires_at) = access_grant.expires_at {
            require!(current_time <= expires_at, AccessError::AccessExpired);
        }
        
        // For subscription-based access, verify continuous token holding
        if access_rule.access_type == AccessType::Subscription {
            let user_token_account = &ctx.accounts.user_token_account;
            require!(
                user_token_account.amount >= access_rule.min_tokens_required,
                AccessError::InsufficientTokens
            );
        }
        
        // Update access stats
        let access_grant_mut = &mut ctx.accounts.access_grant;
        access_grant_mut.access_count += 1;
        access_grant_mut.last_accessed = Some(current_time);
        
        emit!(AccessVerified {
            grant: access_grant.key(),
            user: ctx.accounts.user.key(),
            timestamp: current_time,
            access_count: access_grant_mut.access_count,
        });
        
        Ok(true)
    }

    /// Revoke access
    pub fn revoke_access(ctx: Context<RevokeAccess>) -> Result<()> {
        let access_rule = &ctx.accounts.access_rule;
        
        // Only creator can revoke access
        require!(
            ctx.accounts.authority.key() == access_rule.creator,
            AccessError::Unauthorized
        );
        
        let access_grant = &mut ctx.accounts.access_grant;
        access_grant.is_active = false;
        
        emit!(AccessRevoked {
            grant: access_grant.key(),
            user: access_grant.user,
            revoked_by: ctx.accounts.authority.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Update access rule
    pub fn update_access_rule(
        ctx: Context<UpdateAccessRule>,
        new_min_tokens: Option<u64>,
        new_expiry_duration: Option<Option<i64>>,
        is_active: Option<bool>,
    ) -> Result<()> {
        let access_rule = &mut ctx.accounts.access_rule;
        
        if let Some(min_tokens) = new_min_tokens {
            access_rule.min_tokens_required = min_tokens;
        }
        
        if let Some(expiry) = new_expiry_duration {
            access_rule.expiry_duration = expiry;
        }
        
        if let Some(active) = is_active {
            access_rule.is_active = active;
        }
        
        emit!(AccessRuleUpdated {
            rule: access_rule.key(),
            updated_by: ctx.accounts.creator.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// Batch verify access for multiple resources
    pub fn batch_verify_access(
        ctx: Context<BatchVerifyAccess>,
        resource_ids: Vec<String>,
    ) -> Result<Vec<bool>> {
        require!(resource_ids.len() <= 10, AccessError::TooManyResources);
        
        let mut results = Vec::new();
        
        for resource_id in resource_ids {
            // In a real implementation, this would check each resource
            // For this example, we'll assume access is granted if user has any tokens
            let has_access = ctx.accounts.user_token_account.amount > 0;
            results.push(has_access);
        }
        
        emit!(BatchAccessVerified {
            user: ctx.accounts.user.key(),
            resource_count: results.len() as u8,
            granted_count: results.iter().filter(|&&x| x).count() as u8,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(results)
    }

    /// Create a time-limited access pass
    pub fn create_time_pass(
        ctx: Context<CreateTimePass>,
        duration_hours: u32,
        max_uses: u32,
    ) -> Result<()> {
        require!(duration_hours <= 168, AccessError::DurationTooLong); // Max 1 week
        require!(max_uses <= 100, AccessError::TooManyUses);
        
        let current_time = Clock::get()?.unix_timestamp;
        let expires_at = current_time + (duration_hours as i64 * 3600);
        
        let time_pass = &mut ctx.accounts.time_pass;
        time_pass.access_rule = ctx.accounts.access_rule.key();
        time_pass.user = ctx.accounts.user.key();
        time_pass.created_at = current_time;
        time_pass.expires_at = expires_at;
        time_pass.max_uses = max_uses;
        time_pass.uses_remaining = max_uses;
        time_pass.is_active = true;
        time_pass.bump = ctx.bumps.time_pass;
        
        emit!(TimePassCreated {
            pass: time_pass.key(),
            user: ctx.accounts.user.key(),
            expires_at,
            max_uses,
        });
        
        Ok(())
    }
}

#[account]
pub struct AccessRule {
    pub agent: Pubkey,
    pub creator: Pubkey,
    pub resource_id: String,
    pub min_tokens_required: u64,
    pub access_type: AccessType,
    pub expiry_duration: Option<i64>,
    pub created_at: i64,
    pub is_active: bool,
    pub total_accesses: u64,
    pub bump: u8,
}

#[account]
pub struct AccessGrant {
    pub access_rule: Pubkey,
    pub user: Pubkey,
    pub granted_at: i64,
    pub expires_at: Option<i64>,
    pub is_active: bool,
    pub access_count: u32,
    pub last_accessed: Option<i64>,
    pub bump: u8,
}

#[account]
pub struct TimePass {
    pub access_rule: Pubkey,
    pub user: Pubkey,
    pub created_at: i64,
    pub expires_at: i64,
    pub max_uses: u32,
    pub uses_remaining: u32,
    pub is_active: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq)]
pub enum AccessType {
    OneTime,     // Single purchase grants access
    Subscription, // Must hold tokens continuously  
    Tiered,      // Different levels based on token amount
    TimePass,    // Temporary access pass
}

#[derive(Accounts)]
#[instruction(resource_id: String)]
pub struct CreateAccessRule<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    /// CHECK: Agent account
    pub agent: AccountInfo<'info>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 32 + 64 + 8 + 1 + 9 + 8 + 1 + 8 + 1, // Extra space for strings
        seeds = [b"access_rule", agent.key().as_ref(), resource_id.as_bytes()],
        bump
    )]
    pub access_rule: Account<'info, AccessRule>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GrantAccess<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub access_rule: Account<'info, AccessRule>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 9 + 1 + 4 + 9 + 1,
        seeds = [b"access_grant", access_rule.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub access_grant: Account<'info, AccessGrant>,
    
    #[account(
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == agent_token_mint.key(),
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub agent_token_mint: Account<'info, Mint>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyAccess<'info> {
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub access_grant: Account<'info, AccessGrant>,
    
    pub access_rule: Account<'info, AccessRule>,
    
    #[account(
        constraint = user_token_account.owner == user.key(),
    )]
    pub user_token_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct RevokeAccess<'info> {
    pub authority: Signer<'info>,
    
    pub access_rule: Account<'info, AccessRule>,
    
    #[account(mut)]
    pub access_grant: Account<'info, AccessGrant>,
}

#[derive(Accounts)]
pub struct UpdateAccessRule<'info> {
    pub creator: Signer<'info>,
    
    #[account(
        mut,
        has_one = creator,
    )]
    pub access_rule: Account<'info, AccessRule>,
}

#[derive(Accounts)]
pub struct BatchVerifyAccess<'info> {
    pub user: Signer<'info>,
    
    #[account(
        constraint = user_token_account.owner == user.key(),
    )]
    pub user_token_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct CreateTimePass<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub access_rule: Account<'info, AccessRule>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 4 + 4 + 1 + 1,
        seeds = [b"time_pass", access_rule.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub time_pass: Account<'info, TimePass>,
    
    pub system_program: Program<'info, System>,
}

#[event]
pub struct AccessRuleCreated {
    pub rule: Pubkey,
    pub agent: Pubkey,
    pub resource_id: String,
    pub min_tokens_required: u64,
    pub access_type: AccessType,
}

#[event]
pub struct AccessGranted {
    pub grant: Pubkey,
    pub rule: Pubkey,
    pub user: Pubkey,
    pub granted_at: i64,
    pub expires_at: Option<i64>,
}

#[event]
pub struct AccessVerified {
    pub grant: Pubkey,
    pub user: Pubkey,
    pub timestamp: i64,
    pub access_count: u32,
}

#[event]
pub struct AccessRevoked {
    pub grant: Pubkey,
    pub user: Pubkey,
    pub revoked_by: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct AccessRuleUpdated {
    pub rule: Pubkey,
    pub updated_by: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct BatchAccessVerified {
    pub user: Pubkey,
    pub resource_count: u8,
    pub granted_count: u8,
    pub timestamp: i64,
}

#[event]
pub struct TimePassCreated {
    pub pass: Pubkey,
    pub user: Pubkey,
    pub expires_at: i64,
    pub max_uses: u32,
}

#[error_code]
pub enum AccessError {
    #[msg("Resource ID too long (max 64 characters)")]
    ResourceIdTooLong,
    #[msg("Access rule is inactive")]
    AccessRuleInactive,
    #[msg("Insufficient tokens for access")]
    InsufficientTokens,
    #[msg("Access grant is inactive")]
    AccessGrantInactive,
    #[msg("Access has expired")]
    AccessExpired,
    #[msg("Unauthorized operation")]
    Unauthorized,
    #[msg("Too many resources (max 10)")]
    TooManyResources,
    #[msg("Duration too long (max 1 week)")]
    DurationTooLong,
    #[msg("Too many uses (max 100)")]
    TooManyUses,
}