'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { User, Settings, Lock, Save, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  defaultPhone?: string
  defaultLocation?: string
  defaultContactMethod?: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    defaultPhone: '',
    defaultLocation: '',
    defaultContactMethod: 'email'
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile()
    }
  }, [isAuthenticated, user])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          defaultPhone: data.defaultPhone || '',
          defaultLocation: data.defaultLocation || '',
          defaultContactMethod: data.defaultContactMethod || 'email'
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
        setMessage('Profile updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('Error updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        setMessage('Password changed successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to change password')
      }
    } catch (error) {
      setError('Error changing password')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !profile) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and defaults</p>
      </div>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline h-4 w-4 mr-1" />
                Default Phone
              </label>
              <input
                type="tel"
                value={formData.defaultPhone}
                onChange={(e) => setFormData({ ...formData, defaultPhone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">This will be used as default contact for new items</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />
                Default Location
              </label>
              <input
                type="text"
                value={formData.defaultLocation}
                onChange={(e) => setFormData({ ...formData, defaultLocation: e.target.value })}
                placeholder="e.g., Back Room - Section A"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Default location for your items</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="inline h-4 w-4 mr-1" />
                Preferred Contact Method
              </label>
              <select
                value={formData.defaultContactMethod}
                onChange={(e) => setFormData({ ...formData, defaultContactMethod: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    name: profile.name || '',
                    defaultPhone: profile.defaultPhone || '',
                    defaultLocation: profile.defaultLocation || '',
                    defaultContactMethod: profile.defaultContactMethod || 'email'
                  })
                }}
                className="text-gray-600 px-4 py-2 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <p className="font-medium">{profile.name || 'Not set'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Role:</span>
              <p className="font-medium capitalize">{profile.role.toLowerCase()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Default Phone:</span>
              <p className="font-medium">{profile.defaultPhone || 'Not set'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Default Location:</span>
              <p className="font-medium">{profile.defaultLocation || 'Not set'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Member Since:</span>
              <p className="font-medium">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5" />
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={6}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              minLength={6}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
        <div className="space-y-3">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700 block"
          >
            Forgot Password? Reset via Email
          </Link>
          <button
            onClick={() => {
              logout()
              router.push('/login')
            }}
            className="text-red-600 hover:text-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}