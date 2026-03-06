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

    const apiKey = authHeader.slice(7); // Remove "Bearer " prefix
    
    if (!apiKey.startsWith('ak_live_')) {
      return NextResponse.json({
        success: false,
        error: "invalid_api_key",
        message: "Invalid API key format"
      }, { status: 401 });
    }

    // TODO: Validate API key against database
    // const agent = await db.agents.findUnique({ where: { api_key: apiKey } });
    
    // Mock agent data for demo
    const agent = {
      id: "agent_abc123",
      name: "DemoAgent",
      description: "Demo agent for AgentKeys testing",
      category: "research",
      status: "verified",
      capability_score: 85,
      wallet_address: "4tYYdhWSGMdAs9rcB35MwL2AFVJX6WY2kjATrJP97GEA",
      created_at: "2026-03-06T12:00:00Z",
      last_active: "2026-03-06T19:30:00Z",
      
      // Portfolio data
      portfolio: {
        total_value_sol: 47.35,
        keys_held: 23,
        keys_sold: 156,
        pnl_sol: 12.48,
        pnl_percentage: 35.7
      },
      
      // Performance metrics
      performance: {
        success_rate: 94.2,
        avg_response_time_ms: 1847,
        tasks_completed: 1247,
        uptime_percentage: 99.8
      },
      
      // Social metrics
      social: {
        github_repo: "https://github.com/demo/agent",
        twitter_handle: "@DemoAgent",
        follower_count: 342,
        endorsements: 15
      }
    };

    if (!agent) {
      return NextResponse.json({
        success: false,
        error: "agent_not_found",
        message: "Agent not found or API key invalid"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      agent
    });

  } catch (error) {
    console.error('Get agent profile error:', error);
    
    return NextResponse.json({
      success: false,
      error: "internal_error",
      message: "Failed to retrieve agent profile"
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Extract API key
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: "unauthorized",
        message: "Missing or invalid Authorization header"
      }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    const body = await request.json();
    
    // Validate updatable fields
    const allowedFields = ['description', 'github_repo', 'twitter_handle'];
    const updates = Object.keys(body).filter(key => allowedFields.includes(key));
    
    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        error: "no_valid_fields",
        message: "No valid fields to update",
        allowed_fields: allowedFields
      }, { status: 400 });
    }

    // TODO: Update agent in database
    // const updatedAgent = await db.agents.update({
    //   where: { api_key: apiKey },
    //   data: updates
    // });

    return NextResponse.json({
      success: true,
      message: "Agent profile updated successfully",
      updated_fields: updates
    });

  } catch (error) {
    console.error('Update agent profile error:', error);
    
    return NextResponse.json({
      success: false,
      error: "internal_error", 
      message: "Failed to update agent profile"
    }, { status: 500 });
  }
}