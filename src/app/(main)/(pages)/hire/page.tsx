'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/global/navbar'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

interface ListingItem {
  _id?: string  // Convex uses string IDs
  title: string
  description: string
  price: number
  category: 'machinery' | 'tool'
}

const HomePage = () => {
  const [newListing, setNewListing] = useState<Omit<ListingItem, '_id'>>({
    title: '',
    description: '',
    price: 0,
    category: 'machinery'
  })

  const createListing = useMutation(api.listings.createListing)
  const listings = useQuery(api.listings.getListings) || []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewListing(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createListing(newListing)
      setNewListing({
        title: '',
        description: '',
        price: 0,
        category: 'machinery'
      })
    } catch (error) {
      console.error('Error creating listing:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 pt-24">
        <h1 className="text-3xl font-bold mb-6">List Your Machinery and Tools</h1>
        
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
          {/* Form fields remain the same */}
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(listing => (
            <div key={listing._id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
              <p className="text-gray-600 mb-2">{listing.description}</p>
              <p className="font-bold">${listing.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">Category: {listing.category}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default HomePage