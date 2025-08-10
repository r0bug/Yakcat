'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { AuthenticatedUploadButton } from '@/components/AuthenticatedUploadButton'

interface ItemImage {
  id: string
  url: string
  key: string
  order: number
}

interface Item {
  id: string
  title: string
  description: string | null
  price: number | null
  location: string | null
  contactInfo: string | null
  status: string
  slug: string
  images: ItemImage[]
  vendorId: string
}

export default function EditItemPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [item, setItem] = useState<Item | null>(null)
  const [images, setImages] = useState<{ url: string; key: string }[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    contactInfo: '',
    status: 'AVAILABLE'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchItem()
    }
  }, [isAuthenticated, resolvedParams.slug])

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items/slug/${resolvedParams.slug}`)
      if (response.ok) {
        const data = await response.json()
        
        // Check if user owns the item or is admin/staff
        if (data.vendorId !== user?.id && user?.role === 'VENDOR') {
          alert('You do not have permission to edit this item')
          router.push('/my-items')
          return
        }
        
        setItem(data)
        setFormData({
          title: data.title,
          description: data.description || '',
          price: data.price?.toString() || '',
          location: data.location || '',
          contactInfo: data.contactInfo || '',
          status: data.status
        })
        setImages(data.images.map((img: ItemImage) => ({
          url: img.url,
          key: img.key
        })))
      } else {
        alert('Item not found')
        router.push('/my-items')
      }
    } catch (error) {
      console.error('Error fetching item:', error)
      alert('Error loading item')
      router.push('/my-items')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !item) {
      alert('Title is required')
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          images: images,
        }),
      })

      if (response.ok) {
        router.push(`/items/${item.slug}`)
      } else {
        const errorData = await response.json()
        alert(`Failed to update item: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating item:', error)
      alert(`Error updating item: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteImage = async (key: string) => {
    setImages(images.filter(img => img.key !== key))
  }

  if (loading || isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!isAuthenticated || !item) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Item</h1>
        <Link 
          href="/my-items"
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AVAILABLE">Available</option>
            <option value="PENDING">Pending</option>
            <option value="SOLD">Sold</option>
            <option value="REMOVED">Removed</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Images (Max 6)
          </label>
          
          {/* Display uploaded images */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={image.key} className="relative">
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.key)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          {images.length < 6 && (
            <AuthenticatedUploadButton
              endpoint="itemImage"
              onClientUploadComplete={(res) => {
                if (res) {
                  const newImages = res.map(file => ({
                    url: file.url,
                    key: file.key,
                  }))
                  setImages([...images, ...newImages])
                }
              }}
              onUploadError={(error: Error) => {
                alert(`Upload failed: ${error.message}`)
              }}
              appearance={{
                button: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700",
                container: "w-full",
              }}
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Back Room - Section A"
          />
        </div>

        {/* Contact Info */}
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium mb-2">
            Contact Info
          </label>
          <input
            type="text"
            id="contactInfo"
            value={formData.contactInfo}
            onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone or email"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Item'}
        </button>
      </form>
    </div>
  )
}