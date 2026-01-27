import { describe, it, expect } from 'vitest'
import { GET } from '../app/api/items/route'
import { NextRequest } from 'next/server'

describe('API Integration Test', () => {
    it('should return 200 for GET items', async () => {
        // Mock request
        const req = new NextRequest('http://localhost:3000/api/items')
        const res = await GET(req)
        
        expect(res.status).toBe(200)
    })
})
