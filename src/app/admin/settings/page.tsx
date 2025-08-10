'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Settings, Save, Globe, Mail, Bell, Shield, Database } from 'lucide-react'

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  maxImagesPerItem: number
  requireApproval: boolean
  maintenanceMode: boolean
  allowRegistration: boolean
  emailNotifications: boolean
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'YakCat',
    siteDescription: 'Consignment Mall Catalog System',
    contactEmail: 'admin@yakcat.com',
    maxImagesPerItem: 6,
    requireApproval: false,
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

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
      fetchSettings()
    }
  }, [isAuthenticated, user])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSavedMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setSavedMessage('Settings saved successfully!')
        setTimeout(() => setSavedMessage(''), 3000)
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      alert('Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Dashboard
        </button>
      </div>

      {savedMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6">
          {savedMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Item Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Item Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="maxImages" className="block text-sm font-medium text-gray-700 mb-1">
                Max Images Per Item
              </label>
              <input
                type="number"
                id="maxImages"
                min="1"
                max="10"
                value={settings.maxImagesPerItem}
                onChange={(e) => setSettings({ ...settings, maxImagesPerItem: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Require approval for new items
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                Items must be approved by admin/staff before appearing publicly
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Allow new user registration
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                Disable to prevent new users from signing up
              </p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                Only admins can access the site when enabled
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable email notifications
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                Send email notifications for messages and important events
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}