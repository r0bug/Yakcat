'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Send, Inbox, Archive } from 'lucide-react'

interface Message {
  id: string
  subject: string
  body: string
  read: boolean
  createdAt: string
  sender: {
    id: string
    name: string | null
    email: string
  }
  recipient: {
    id: string
    name: string | null
    email: string
  }
}

export default function MessagesPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [newMessage, setNewMessage] = useState({
    recipientEmail: '',
    subject: '',
    body: ''
  })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages()
    }
  }, [isAuthenticated, activeTab])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const endpoint = activeTab === 'inbox' ? '/api/messages' : '/api/messages/sent'
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.recipientEmail || !newMessage.subject || !newMessage.body) {
      alert('All fields are required')
      return
    }

    setSending(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newMessage)
      })

      if (response.ok) {
        setNewMessage({ recipientEmail: '', subject: '', body: '' })
        setShowCompose(false)
        if (activeTab === 'sent') {
          fetchMessages()
        }
        alert('Message sent successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to send message: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert('Error sending message')
    } finally {
      setSending(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read && activeTab === 'inbox') {
      markAsRead(message.id)
    }
  }

  if (loading || isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Send className="h-5 w-5" />
          Compose
        </button>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">New Message</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium mb-2">
                  To (Email)
                </label>
                <input
                  type="email"
                  id="recipient"
                  value={newMessage.recipientEmail}
                  onChange={(e) => setNewMessage({ ...newMessage, recipientEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="recipient@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Message subject"
                  required
                />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="body"
                  rows={6}
                  value={newMessage.body}
                  onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('inbox')
                  setSelectedMessage(null)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'inbox' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Inbox className="h-5 w-5" />
                <span>Inbox</span>
                {messages.filter(m => !m.read).length > 0 && activeTab === 'inbox' && (
                  <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {messages.filter(m => !m.read).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('sent')
                  setSelectedMessage(null)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'sent' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Send className="h-5 w-5" />
                <span>Sent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Message List or Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-blue-600 hover:text-blue-700 mb-4"
              >
                ← Back to messages
              </button>
              <h2 className="text-xl font-semibold mb-2">{selectedMessage.subject}</h2>
              <div className="text-sm text-gray-600 mb-4">
                <div>From: {selectedMessage.sender.name || selectedMessage.sender.email}</div>
                <div>To: {selectedMessage.recipient.name || selectedMessage.recipient.email}</div>
                <div>{new Date(selectedMessage.createdAt).toLocaleString()}</div>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              {messages.length === 0 ? (
                <div className="p-12 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {activeTab === 'inbox' ? 'No messages in your inbox' : 'No sent messages'}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        !message.read && activeTab === 'inbox' ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!message.read && activeTab === 'inbox' && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                            <span className="font-medium">
                              {activeTab === 'inbox' 
                                ? message.sender.name || message.sender.email
                                : message.recipient.name || message.recipient.email
                              }
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">{message.subject}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{message.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}