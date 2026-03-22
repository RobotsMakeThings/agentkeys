"use strict";(()=>{var e={};e.id=203,e.ids=[203],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},53043:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>g,patchFetch:()=>m,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>_,staticGenerationAsyncStorage:()=>c});var i={};s.r(i),s.d(i,{GET:()=>d});var n=s(49303),r=s(88716),a=s(60670),o=s(1926),l=s(95456);async function d(e){let t=await (0,l.V8)(e);if(!t)return(0,l.m)();let{data:s,error:i}=await o.p.from("card_holdings").select(`
      *,
      collection:collections(
        id, name, rarity_tier, pack_image_uri, minted_count, max_supply,
        is_free, price_sol, is_active
      ),
      skill_set:skill_sets(
        id, name, description, rarity_tier, power_level, is_published,
        creator:agents!creator_agent_id(id, name, avatar_url, wallet_address),
        members:skill_set_members(
          id, position,
          skill:skills(id, name, slug, current_version)
        )
      ),
      skill_versions:holding_skill_versions(
        id, skill_id, active_version,
        skill:skills(id, name, slug, current_version)
      )
    `).eq("owner_agent_id",t.agentId).eq("skill_access_active",!0).order("acquired_at",{ascending:!1});if(i)return(0,l.VR)("Failed to fetch holdings",500);let n=(s??[]).map(e=>({...e,skill_set:e.skill_set?{...e.skill_set,members:(e.skill_set.members??[]).sort((e,t)=>e.position-t.position)}:null}));return(0,l.Xj)(n)}let p=new n.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/agents/me/holdings/route",pathname:"/api/agents/me/holdings",filename:"route",bundlePath:"app/api/agents/me/holdings/route"},resolvedPagePath:"/home/kaji-squad/agents/kaji/projects/agentkeys/repo/src/app/api/agents/me/holdings/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:c,serverHooks:_}=p,g="/api/agents/me/holdings/route";function m(){return(0,a.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:c})}},95456:(e,t,s)=>{s.d(t,{V8:()=>n,VR:()=>a,Xj:()=>o,m:()=>r});var i=s(1926);async function n(e){let t=e.headers.get("x-agent-key");if(!t)return null;let{data:s,error:n}=await i.p.from("agents").select("id").eq("api_key",t).eq("is_active",!0).single();return n||!s?null:{agentId:s.id}}function r(){return new Response(JSON.stringify({data:null,error:{code:"UNAUTHORIZED",message:"Invalid or missing API key"}}),{status:401,headers:{"Content-Type":"application/json"}})}function a(e,t=400){return new Response(JSON.stringify({data:null,error:{code:"ERROR",message:e}}),{status:t,headers:{"Content-Type":"application/json"}})}function o(e,t=200){return new Response(JSON.stringify({data:e,error:null}),{status:t,headers:{"Content-Type":"application/json"}})}},1926:(e,t,s)=>{s.d(t,{p:()=>a});var i=s(37857);let n="https://placeholder.supabase.co",r=process.env.SUPABASE_SERVICE_ROLE_KEY;(0,i.eI)(n,"placeholder_anon_key");let a=(0,i.eI)(n,r)}};var t=require("../../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[948,572],()=>s(53043));module.exports=i})();