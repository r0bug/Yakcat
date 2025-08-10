'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Plus, Pin } from 'lucide-react'

interface ForumPost {
  id: string
  title: string
  content: string
  pinned: boolean
  createdAt: string
  author: {
    name: string | null
    email: string
  }
  _count?: {
    replies: number
  }
}

export default function ForumPage() {
  const { user, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/forum')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching forum posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.title || !newPost.content) {
      alert('Title and content are required')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newPost)
      })

      if (response.ok) {
        const post = await response.json()
        setPosts([post, ...posts])
        setNewPost({ title: '', content: '' })
        setShowNewPost(false)
      } else {
        alert('Failed to create post')
      }
    } catch (error) {
      alert('Error creating post')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading forum posts...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        {isAuthenticated && (
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Post
          </button>
        )}
      </div>

      {/* New Post Form */}
      {showNewPost && isAuthenticated && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Content
              </label>
              <textarea
                id="content"
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your post content"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewPost(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No forum posts yet</p>
          {isAuthenticated ? (
            <button
              onClick={() => setShowNewPost(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              Be the first to post →
            </button>
          ) : (
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Login to create a post →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {post.pinned && (
                      <Pin className="h-4 w-4 text-red-500" />
                    )}
                    <h2 className="text-xl font-semibold">
                      <Link href={`/forum/${post.id}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h2>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {post.author.name || post.author.email}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    {post._count && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post._count.replies} {post._count.replies === 1 ? 'reply' : 'replies'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}