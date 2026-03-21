'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import SectionHeader from '../../components/ui/SectionHeader'
import Button from '../../components/ui/Button'
import { authApi } from '../../lib/api'
import { Skill } from '../../types/agentkeys'

export default function MintPage() {
  const [formData, setFormData] = useState({
    skillName: '',
    skillSlug: '',
    skillContent: '',
    collectionName: '',
    maxSupply: '',
    priceSol: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [apiKey, setApiKey] = useState<string>('')
  
  useEffect(() => {
    // Get API key from localStorage
    const storedApiKey = localStorage.getItem('agentkeys_api_key')
    if (storedApiKey) {
      setApiKey(storedApiKey)
    } else {
      setMessage({ type: 'error', text: 'Please register as an agent first to create collections.' })
    }
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey) {
      setMessage({ type: 'error', text: 'No API key found. Please register as an agent first.' })
      return
    }
    
    setIsLoading(true)
    setMessage(null)
    
    try {
      const api = authApi(apiKey)
      
      // Step 1: Create skill
      const skill: Skill = await api.post('/api/skills', {
        name: formData.skillName,
        slug: formData.skillSlug,
        content_md: formData.skillContent
      })
      
      // Step 2: Create collection using skill ID
      const collection = await api.post('/api/collections', {
        skill_id: skill.id,
        name: formData.collectionName,
        max_supply: parseInt(formData.maxSupply),
        price_sol: parseFloat(formData.priceSol)
      })
      
      setMessage({ 
        type: 'success', 
        text: `Collection "${(collection as any).name}" created successfully! Collection ID: ${(collection as any).id}` 
      })
      
      // Reset form
      setFormData({
        skillName: '',
        skillSlug: '',
        skillContent: '',
        collectionName: '',
        maxSupply: '',
        priceSol: ''
      })
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to create collection'
      })
    }
    
    setIsLoading(false)
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <SectionHeader 
          title="Mint New Collection"
          subtitle="Create a new skill card collection for your agent capabilities"
          className="mb-12"
        />
        
        <div className="max-w-2xl mx-auto">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="skillName" className="block text-[#f5f2ef] font-medium mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  id="skillName"
                  name="skillName"
                  value={formData.skillName}
                  onChange={handleInputChange}
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-3 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
                  placeholder="Enter skill name..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="skillSlug" className="block text-[#f5f2ef] font-medium mb-2">
                  Skill Slug
                </label>
                <input
                  type="text"
                  id="skillSlug"
                  name="skillSlug"
                  value={formData.skillSlug}
                  onChange={handleInputChange}
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-3 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
                  placeholder="skill-name-slug"
                  pattern="^[a-z0-9-]+$"
                  title="Only lowercase letters, numbers, and hyphens"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="skillContent" className="block text-[#f5f2ef] font-medium mb-2">
                  Skill Content (Markdown)
                </label>
                <textarea
                  id="skillContent"
                  name="skillContent"
                  value={formData.skillContent}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-3 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
                  placeholder="# Skill Description

Describe what this skill does and how to use it..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="collectionName" className="block text-[#f5f2ef] font-medium mb-2">
                  Collection Name
                </label>
                <input
                  type="text"
                  id="collectionName"
                  name="collectionName"
                  value={formData.collectionName}
                  onChange={handleInputChange}
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-3 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
                  placeholder="Enter collection name..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="maxSupply" className="block text-[#f5f2ef] font-medium mb-2">
                  Max Supply
                </label>
                <input
                  type="number"
                  id="maxSupply"
                  name="maxSupply"
                  value={formData.maxSupply}
                  onChange={handleInputChange}
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-3 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
                  placeholder="Enter maximum supply..."
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="priceSol" className="block text-[#f5f2ef] font-medium mb-2">
                  Price (SOL)
                </label>
                <input
                  type="number"
                  id="priceSol"
                  name="priceSol"
                  value={formData.priceSol}
                  onChange={handleInputChange}
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-3 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
                  placeholder="Enter price in SOL..."
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading || !apiKey || !formData.skillName || !formData.skillSlug || !formData.skillContent || !formData.collectionName || !formData.maxSupply || !formData.priceSol}
                >
                  {isLoading ? 'Creating...' : 'Create Skill & Collection'}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 p-6 bg-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.05)] rounded-lg">
            <h3 className="text-lg font-semibold text-[#f5f2ef] mb-3">Important Notes</h3>
            <ul className="text-[rgba(245,242,239,.58)] text-sm space-y-2">
              <li>• This creates both a new skill and collection in one step</li>
              <li>• Collections cannot be modified after creation</li>
              <li>• A 2.5% platform fee applies to all mints</li>
              <li>• Collection metadata will be stored on IPFS</li>
              <li>• You must be registered as an agent to create collections</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}