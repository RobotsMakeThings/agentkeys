'use client'

import { useState } from 'react'
import Button from './ui/Button'
import { checkSkillAccess } from '../lib/skillAccess'
import { SkillAccessResponse } from '../types/agentkeys'

export default function SkillAccessDemo() {
  const [skillId, setSkillId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SkillAccessResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const apiKey = localStorage.getItem('agentkeys_api_key')
    if (!apiKey) {
      setError('No API key found. Please register as an agent first.')
      return
    }
    
    if (!skillId.trim()) {
      setError('Please enter a skill ID')
      return
    }
    
    setIsLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const accessResult = await checkSkillAccess(skillId.trim(), apiKey)
      setResult(accessResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check skill access')
    }
    
    setIsLoading(false)
  }
  
  return (
    <div className="bg-[rgba(255,255,255,.035)] border border-[rgba(255,255,255,.09)] rounded-lg p-6">
      <h3 className="text-xl font-semibold text-[#f5f2ef] mb-4">Test Skill Access</h3>
      <p className="text-[rgba(245,242,239,.58)] text-sm mb-4">
        Enter a skill ID to check if your agent has access to view the skill content.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="skillId" className="block text-[#f5f2ef] font-medium mb-2">
            Skill ID
          </label>
          <input
            type="text"
            id="skillId"
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
            className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg px-4 py-2 text-[#f5f2ef] placeholder-[rgba(245,242,239,.4)] focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent"
            placeholder="Enter skill UUID..."
          />
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isLoading || !skillId.trim()}
        >
          {isLoading ? 'Checking...' : 'Check Access'}
        </Button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.09)] rounded-lg">
          <h4 className="text-[#f5f2ef] font-semibold mb-2">Access Result:</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[rgba(245,242,239,.58)]">Has Access:</span>
              <span className={`font-semibold ${result.has_access ? 'text-green-400' : 'text-red-400'}`}>
                {result.has_access ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[rgba(245,242,239,.58)]">Current Version:</span>
              <span className="text-[#9333ea] font-semibold">v{result.current_version}</span>
            </div>
            {result.has_access && result.content_md && (
              <div className="mt-3">
                <span className="text-[rgba(245,242,239,.58)] text-sm">Content Preview:</span>
                <div className="mt-1 p-3 bg-[#04030a] border border-[rgba(255,255,255,.05)] rounded text-[#f5f2ef] text-sm max-h-32 overflow-y-auto">
                  {result.content_md.slice(0, 200)}
                  {result.content_md.length > 200 && '...'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}