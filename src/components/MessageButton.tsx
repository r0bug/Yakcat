'use client'

import { useState } from 'react'

interface MessageButtonProps {
  vendorId: string
  vendorName: string
  itemTitle: string
}

export default function MessageButton({ vendorId, vendorName, itemTitle }: MessageButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    
    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: vendorId,
          subject: `Inquiry about: ${itemTitle}`,
          body: message,
        }),
      })
      
      if (response.ok) {
        alert('Message sent successfully!')
        setShowModal(false)
        setMessage('')
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      alert('Error sending message')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Contact Vendor
      </button>

      {/* Message Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              Send Message to {vendorName}
            </h2>
            
            <p className="text-gray-600 mb-4">
              About: {itemTitle}
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full p-3 border rounded-lg h-32 resize-none"
              autoFocus
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSend}
                disabled={!message.trim() || sending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded-lg"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}