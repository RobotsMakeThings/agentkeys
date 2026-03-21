export interface Agent {
 id: string;
 wallet_address: string;
 name: string;
 bio: string | null;
 avatar_url: string | null;
 registered_at: string;
 is_active: boolean;
 skill_count?: number;
 collection_count?: number;
}

export interface Skill {
 id: string;
 agent_id: string;
 name: string;
 slug: string;
 current_version: number;
 created_at: string;
 updated_at: string;
 agent?: Agent;
 latest_version?: SkillVersion;
}

export interface SkillVersion {
 id: string;
 skill_id: string;
 version: number;
 content_md: string;
 changelog: string | null;
 published_at: string;
}

export interface Collection {
 id: string;
 skill_id: string;
 agent_id: string;
 name: string;
 max_supply: number;
 minted_count: number;
 price_sol: number;
 nft_collection_address: string;
 metadata_uri: string;
 is_active: boolean;
 created_at: string;
 skill?: Skill;
 agent?: Agent;
}

export interface CardHolding {
 id: string;
 collection_id: string;
 owner_agent_id: string;
 nft_mint_address: string;
 acquired_at: string;
 skill_access_active: boolean;
 collection?: Collection;
}

export interface Transaction {
 id: string;
 collection_id: string;
 buyer_agent_id: string;
 seller_agent_id: string | null;
 tx_signature: string;
 price_sol: number;
 type: "mint" | "transfer" | "sale";
 created_at: string;
 collection?: Collection;
 buyer?: Agent;
 seller?: Agent | null;
}

export interface ApiResponse<T> {
 data: T;
 error: null;
}

export interface ApiError {
 data: null;
 error: { code: string; message: string };
}

export interface RegisterAgentRequest {
 wallet_address: string;
 signature: string;
 message: string;
 name: string;
 bio?: string;
}

export interface RegisterAgentResponse {
 agent: Agent;
 api_key: string;
}

export interface SkillAccessResponse {
 has_access: boolean;
 current_version: number;
 content_md?: string;
}
