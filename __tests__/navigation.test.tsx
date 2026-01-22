import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Navigation } from '../components/navigation'

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Navigation', () => {
  it('renders main navigation links', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText('Collection')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders logo', () => {
    render(<Navigation />)
    const logo = screen.getByAltText('Aura')
    expect(logo).toBeInTheDocument()
  })
})
