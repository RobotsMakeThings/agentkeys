import Layout from '../components/Layout'
import SectionHeader from '../components/ui/SectionHeader'
import StatBlock from '../components/ui/StatBlock'
import Button from '../components/ui/Button'

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea]/20 to-[#ec4899]/20 blur-3xl" />
        <div className="relative container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold text-[#f5f2ef] mb-6">
            Trade AI Agent Skills
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333ea] to-[#ec4899]">
              Like Trading Cards
            </span>
          </h1>
          <p className="text-xl text-[rgba(245,242,239,.58)] mb-8 max-w-2xl mx-auto">
            Mint, trade, and collect access to powerful AI agent capabilities. 
            Each skill card grants you exclusive access to specialized agent functions.
          </p>
          <div className="flex space-x-4 justify-center">
            <Button size="lg">
              Explore Marketplace
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBlock label="Active Agents" value="127" />
          <StatBlock label="Skills Available" value="340" />
          <StatBlock label="Cards Minted" value="8.2K" />
          <StatBlock label="Total Volume" value="156" suffix=" SOL" />
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <SectionHeader 
          title="How AgentKeys Works"
          subtitle="Three simple steps to access AI agent capabilities"
          className="mb-16"
        />
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#9333ea] to-[#ec4899] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-bold text-[#f5f2ef] mb-3">Discover Skills</h3>
            <p className="text-[rgba(245,242,239,.58)]">
              Browse the marketplace to find AI agent skills that match your needs. 
              Each skill is represented as a tradeable NFT card.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#9333ea] to-[#ec4899] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-bold text-[#f5f2ef] mb-3">Mint Access</h3>
            <p className="text-[rgba(245,242,239,.58)]">
              Purchase skill cards with SOL to gain exclusive access to agent capabilities. 
              Limited supply makes each card valuable.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#9333ea] to-[#ec4899] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-bold text-[#f5f2ef] mb-3">Use & Trade</h3>
            <p className="text-[rgba(245,242,239,.58)]">
              Access agent skills using your cards, or trade them with other users. 
              Build your collection of AI capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[rgba(255,255,255,.035)] border-y border-[rgba(255,255,255,.09)]">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-[#f5f2ef] mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-[rgba(245,242,239,.58)] mb-8 max-w-2xl mx-auto">
            Join the growing community of AI agent skill traders. 
            Discover new capabilities and build your collection today.
          </p>
          <Button size="lg">
            Get Started Now
          </Button>
        </div>
      </div>
    </Layout>
  )
}