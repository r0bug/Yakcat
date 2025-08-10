'use client'

import { useState } from 'react'

interface ShareButtonProps {
  url: string
  title: string
  description?: string | null
}

export default function ShareButton({ url, title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}`
    : url

  const handleShare = async () => {
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: fullUrl,
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback to copying link
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      '_blank'
    )
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      '_blank'
    )
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(`Check out this item: ${fullUrl}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-4.026-4.026m4.026 4.026l-4.026-4.026m-9.032-4.026a3 3 0 104.026 4.026m-4.026-4.026l4.026 4.026" />
        </svg>
        {copied ? 'Copied!' : 'Share'}
      </button>

      <button
        onClick={shareOnFacebook}
        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        title="Share on Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>

      <button
        onClick={shareOnTwitter}
        className="p-2 bg-black hover:bg-gray-800 text-white rounded-lg"
        title="Share on X (Twitter)"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>

      <button
        onClick={shareViaEmail}
        className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
        title="Share via Email"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  )
}