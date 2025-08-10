'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Users, Package, MessageSquare, Calendar, TrendingUp, Settings } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalItems: number
  totalMessages: number
  totalEvents: number
  recentItems: any[]
  recentUsers: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.role !== 'ADMIN') {
        router.push('/')
      }
    }
  }, [loading, isAuthenticated, user, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchStats()
    }
  }, [isAuthenticated, user])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">{stats?.totalItems || 0}</p>
            </div>
            <Package className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-2xl font-bold">{stats?.totalMessages || 0}</p>
            </div>
            <MessageSquare className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Events</p>
              <p className="text-2xl font-bold">{stats?.totalEvents || 0}</p>
            </div>
            <Calendar className="h-10 w-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Items</h2>
          </div>
          <div className="p-6">
            {stats?.recentItems && stats.recentItems.length > 0 ? (
              <div className="space-y-3">
                {stats.recentItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        by {item.vendor?.name || item.vendor?.email}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                      item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'SOLD' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent items</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Users</h2>
          </div>
          <div className="p-6">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-3">
                {stats.recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name || user.email}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      user.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent users</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/admin/users')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-left"
          >
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <p className="font-medium">Manage Users</p>
            <p className="text-sm text-gray-500">View and manage all users</p>
          </button>
          
          <button
            onClick={() => router.push('/admin/items')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-left"
          >
            <Package className="h-8 w-8 text-green-500 mb-2" />
            <p className="font-medium">Manage Items</p>
            <p className="text-sm text-gray-500">View and moderate items</p>
          </button>
          
          <button
            onClick={() => router.push('/admin/settings')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-left"
          >
            <Settings className="h-8 w-8 text-gray-500 mb-2" />
            <p className="font-medium">Settings</p>
            <p className="text-sm text-gray-500">Configure site settings</p>
          </button>
        </div>
      </div>
    </div>
  )
}