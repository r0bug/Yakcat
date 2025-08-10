'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, User, LogOut, Plus } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">YakCat</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Browse
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/items/new" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    List Item
                  </Link>
                  <Link href="/my-items" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    My Items
                  </Link>
                  <Link href="/messages" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    Messages
                  </Link>
                </>
              )}
              <Link href="/forum" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Forum
              </Link>
              <Link href="/events" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Events
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 flex items-center">
                  <User className="h-5 w-5 mr-1" />
                  <span className="text-sm">{user?.name || user?.email}</span>
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600 text-sm">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 flex items-center text-sm"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/items/new"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  List Item
                </Link>
                <Link
                  href="/my-items"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Items
                </Link>
                <Link
                  href="/messages"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
              </>
            )}
            <Link
              href="/forum"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Forum
            </Link>
            <Link
              href="/events"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <hr className="my-2" />
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile ({user?.email})
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}