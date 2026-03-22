import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types/agentkeys'
import ActivityRow from '@/components/activity/ActivityRow'

export const dynamic = 'force-dynamic'

async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, collection:collections(id,name), buyer:agents!transactions_buyer_agent_id_fkey(id,name,avatar_url), seller:agents!transactions_seller_agent_id_fkey(id,name,avatar_url)')
    .order('created_at', { ascending: false })
    .limit(20)
  if (error || !data) return []
  return data
}

export default async function ActivityPage() {
  const transactions = await getTransactions()
  return (
    <Layout>
      <main className="min-h-screen bg-background text-foreground px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" data-animate>Activity</h1>
        {transactions.length === 0 ? (
          <p className="text-[rgba(245,242,239,0.4)]">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <ActivityRow key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </main>
    </Layout>
  )
}
