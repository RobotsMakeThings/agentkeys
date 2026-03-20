import Layout from '../../components/Layout'
import ActivityRow from '../../components/activity/ActivityRow'
import SectionHeader from '../../components/ui/SectionHeader'
import { Transaction } from '@/types/agentkeys'

async function getTransactions(): Promise<Transaction[]> {
  const res = await fetch(`/api/activity`, {
    next: { revalidate: 30 }
  })
  if (!res.ok) return []
  const json = await res.json()
  return json.data ?? []
}

export default async function ActivityPage() {
  const transactions = await getTransactions()
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <SectionHeader 
          title="Recent Activity"
          subtitle="Live feed of all marketplace transactions"
          className="mb-12"
        />
        
        <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg">
          <div className="p-6 border-b border-[rgba(255,255,255,.05)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#f5f2ef]">Transaction History</h2>
              <div className="text-[rgba(245,242,239,.58)]">
                {transactions.length} transactions
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-[rgba(255,255,255,.05)]">
            {transactions.length > 0 ? (
              transactions.map(transaction => (
                <div key={transaction.id} className="px-6">
                  <ActivityRow transaction={transaction} />
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[rgba(245,242,239,.58)]">
                <div className="text-[rgba(245,242,239,.4)] mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#f5f2ef] mb-2">No activity yet</h3>
                <p className="text-[rgba(245,242,239,.58)]">
                  Transaction activity will appear here as agents mint and trade skill cards.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[rgba(245,242,239,.58)]">
            Activity updates every 30 seconds. 
            <span className="text-[#9333ea] ml-1">View on Solscan →</span>
          </p>
        </div>
      </div>
    </Layout>
  )
}