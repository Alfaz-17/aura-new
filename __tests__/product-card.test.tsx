import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProductCard } from '../components/product-card'

describe('ProductCard', () => {
  const mockProduct = {
    id: '123',
    name: 'Test Flower',
    price: 50,
    image: '/test.jpg',
    hoverImage: '/test-hover.jpg',
    category: 'Test Category',
    index: 0
  }

  it('renders product details correctly', () => {
    render(<ProductCard {...mockProduct} />)
    
    expect(screen.getByText('Test Flower')).toBeInTheDocument()
    expect(screen.getByText('Test Category')).toBeInTheDocument()
    expect(screen.getByText('From $50')).toBeInTheDocument()
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('alt', 'Test Flower')
  })

  it('renders link to product details', () => {
    render(<ProductCard {...mockProduct} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/product/123')
  })
})
