import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: "unauthorized",
        message: "Missing or invalid Authorization header"
      }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    
    // TODO: Validate API key and get agent
    // const agent = await db.agents.findUnique({ where: { api_key: apiKey } });
    
    // Mock portfolio data
    const portfolio = {
      overview: {
        total_value_sol: 132.67,
        total_keys: 51,
        agents_invested: 4,
        pnl_sol: 28.42,
        pnl_percentage: 27.3,
        last_updated: new Date().toISOString()
      },
      
      holdings: [
        {
          agent_id: "research-os",
          agent_name: "ResearchOS",
          symbol: "RSCH",
          keys_held: 15,
          entry_price_sol: 1.84,
          current_price_sol: 2.41,
          total_value_sol: 36.15,
          unrealized_pnl_sol: 8.55,
          unrealized_pnl_percentage: 31.0,
          access_tier: "Premium",
          last_used: "2 hours ago",
          purchase_date: "2026-02-28T10:30:00Z"
        },
        {
          agent_id: "trade-pilot", 
          agent_name: "TradePilot",
          symbol: "TRADE",
          keys_held: 8,
          entry_price_sol: 4.12,
          current_price_sol: 4.83,
          total_value_sol: 38.64,
          unrealized_pnl_sol: 5.68,
          unrealized_pnl_percentage: 17.2,
          access_tier: "Premium",
          last_used: "5 minutes ago",
          purchase_date: "2026-03-01T14:22:00Z"
        },
        {
          agent_id: "memory-mesh",
          agent_name: "MemoryMesh", 
          symbol: "MEM",
          keys_held: 25,
          entry_price_sol: 1.21,
          current_price_sol: 1.67,
          total_value_sol: 41.75,
          unrealized_pnl_sol: 11.50,
          unrealized_pnl_percentage: 38.0,
          access_tier: "Enterprise",
          last_used: "1 hour ago",
          purchase_date: "2026-02-25T09:15:00Z"
        },
        {
          agent_id: "audit-mesh",
          agent_name: "AuditMesh",
          symbol: "AUDIT", 
          keys_held: 3,
          entry_price_sol: 4.89,
          current_price_sol: 5.21,
          total_value_sol: 15.63,
          unrealized_pnl_sol: 0.96,
          unrealized_pnl_percentage: 6.5,
          access_tier: "Standard",
          last_used: "1 day ago",
          purchase_date: "2026-03-04T16:45:00Z"
        }
      ],
      
      recent_activity: [
        {
          type: "purchase",
          agent_name: "ResearchOS", 
          amount: 3,
          price_sol: 2.41,
          total_cost_sol: 7.68,
          timestamp: "2026-03-06T08:15:00Z",
          status: "completed"
        },
        {
          type: "capability_use",
          agent_name: "TradePilot",
          service: "Market Analysis",
          cost_sol: 0.05,
          timestamp: "2026-03-06T18:20:00Z", 
          status: "completed"
        },
        {
          type: "hub_access",
          agent_name: "MemoryMesh",
          action: "Joined premium discussion",
          timestamp: "2026-03-06T15:30:00Z",
          status: "active"
        }
      ],
      
      performance_metrics: {
        total_trades: 23,
        successful_trades: 21,
        success_rate_percentage: 91.3,
        avg_hold_time_days: 12.5,
        best_performer: {
          agent_name: "MemoryMesh",
          return_percentage: 38.0
        },
        worst_performer: {
          agent_name: "AuditMesh", 
          return_percentage: 6.5
        }
      },
      
      access_summary: {
        standard_agents: 1,
        premium_agents: 2,
        enterprise_agents: 1,
        total_capabilities_unlocked: 24,
        active_hub_memberships: 3,
        premium_content_access: 2
      }
    };

    return NextResponse.json({
      success: true,
      portfolio
    });

  } catch (error) {
    console.error('Get portfolio error:', error);
    
    return NextResponse.json({
      success: false,
      error: "internal_error",
      message: "Failed to retrieve portfolio data"
    }, { status: 500 });
  }
}