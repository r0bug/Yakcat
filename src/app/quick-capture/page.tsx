'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthenticatedUploadButton } from '@/components/AuthenticatedUploadButton'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function QuickCapturePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [captures, setCaptures] = useState<Array<{
    url: string
    key: string
    file?: File
    title?: string
  }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      const timestamp = new Date().toLocaleTimeString()
      setCaptures(prev => [...prev, {
        url,
        key: `temp-${Date.now()}`,
        file,
        title: `Quick Capture ${timestamp}`
      }])
    })
  }

  const handleUploadComplete = (res: any) => {
    if (res) {
      const timestamp = new Date().toLocaleTimeString()
      const newCaptures = res.map((file: any) => ({
        url: file.url,
        key: file.key,
        title: `Quick Capture ${timestamp}`
      }))
      setCaptures(prev => [...prev, ...newCaptures])
    }
  }

  const updateTitle = (index: number, title: string) => {
    setCaptures(prev => prev.map((capture, i) => 
      i === index ? { ...capture, title } : capture
    ))
  }

  const removeCapture = (index: number) => {
    setCaptures(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitAll = async () => {
    if (captures.length === 0) return
    
    setIsSubmitting(true)
    const itemIds = []
    
    try {
      const token = localStorage.getItem('token')
      for (const capture of captures) {
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            title: capture.title || 'Quick Capture Item',
            description: 'Item pending details',
            images: [{ url: capture.url, key: capture.key }],
          }),
        })
        
        if (response.ok) {
          const item = await response.json()
          itemIds.push(item.slug)
        }
      }
      
      if (itemIds.length > 0) {
        // Go to first item or dashboard
        router.push(`/items/${itemIds[0]}`)
      }
    } catch (error) {
      alert('Error creating items')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quick Capture</h1>
        <Link href="/" className="text-gray-600 hover:text-gray-800">
          Cancel
        </Link>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm">
          📸 Quickly photograph multiple items. Take photos first, add details later!
        </p>
      </div>

      {/* Capture Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Camera Input (Mobile) */}
        <label className="block">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleCapture}
            className="hidden"
          />
          <div className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center cursor-pointer">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Take Photo
          </div>
        </label>

        {/* Upload Button */}
        <div className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center">
          <AuthenticatedUploadButton
            endpoint="itemImage"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(error: Error) => {
              alert(`Upload failed: ${error.message}`)
            }}
            appearance={{
              button: "w-full h-full bg-transparent hover:bg-transparent",
              container: "w-full h-full",
              allowedContent: "hidden"
            }}
            content={{
              button: (
                <div>
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Photos
                </div>
              )
            }}
          />
        </div>
      </div>

      {/* Captured Items */}
      {captures.length > 0 && (
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">
            Captured Items ({captures.length})
          </h2>
          
          {captures.map((capture, index) => (
            <div key={capture.key} className="flex gap-4 bg-white p-4 rounded-lg shadow">
              <img
                src={capture.url}
                alt={capture.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={capture.title}
                  onChange={(e) => updateTitle(index, e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                  placeholder="Item title"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Quick capture - details can be added later
                </p>
              </div>
              <button
                onClick={() => removeCapture(index)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit All Button */}
      {captures.length > 0 && (
        <button
          onClick={handleSubmitAll}
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
        >
          {isSubmitting 
            ? 'Creating Items...' 
            : `Create ${captures.length} Item${captures.length > 1 ? 's' : ''}`}
        </button>
      )}

      {captures.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No photos captured yet</p>
          <p className="text-sm mt-2">Use the buttons above to take or upload photos</p>
        </div>
      )}
    </div>
  )
}