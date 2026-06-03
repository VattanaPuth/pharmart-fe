'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Menu from '../../components/Menu'
import Header from '@/components/layout/Header'

const UserIcon = () => (
  <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const LockIcon = () => (
  <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const UserPlusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
)

const LogoIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#e85d8a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

function PasswordField({ placeholder, value, onChange, required }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex items-center border border-gray-200 rounded-[10px] bg-white focus-within:border-[#e85d8a] focus-within:ring-2 focus-within:ring-pink-100 transition-all overflow-hidden">
      <div className="w-10 flex items-center justify-center shrink-0">
        <LockIcon />
      </div>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="flex-1 py-2.5 pr-2 text-sm text-gray-700 placeholder:text-gray-300 outline-none bg-transparent"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="w-10 flex items-center justify-center shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

export default function Register() {
  const router = useRouter()
  const [adminName, setAdminName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onCancel = () => {
    router.push('/dashboard')
  }

  const handleCreateAdmin = (e) => {
    e.preventDefault()
    // Normally save to database
    alert('Admin created successfully!')
    router.push('/dashboard')
  }

  return (
    <>
      <Header />
      <Menu />

      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-6 lg:p-12">

        {/* Centered wrapper */}
        <div className="w-full max-w-155">

          {/* Back link */}
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 transition-colors mb-7"
          >
            <ChevronLeftIcon />
            Back to Admin Accounts
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">

            {/* Card header */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-11 h-11 rounded-[10px] bg-[#fdf0f3] border border-[#f9c3d4] flex items-center justify-center shrink-0">
                <img
    src="/logo.png"
    alt="Pharmart"
    className="h-10 w-auto"
  />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-gray-900">Create Admin Account</h2>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  New admin will be able to log in via the Admin Console
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAdmin}>

              {/* Admin Name */}
              <div className="mb-5">
                <label className="block text-[13px] font-medium text-gray-600 mb-2">
                  Admin Name
                </label>
                <div className="flex items-center border border-gray-200 rounded-[10px] bg-white focus-within:border-[#e85d8a] focus-within:ring-2 focus-within:ring-pink-100 transition-all overflow-hidden">
                  <div className="w-10 flex items-center justify-center shrink-0">
                    <UserIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Dara Sok"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    className="flex-1 py-2.5 pr-3 text-sm text-gray-700 placeholder:text-gray-300 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Password + Confirm Password — side by side */}
              <div className="grid grid-cols-2 gap-4 mb-7">
                <div>
                  <label className="block text-[13px] font-medium text-gray-600 mb-2">
                    Password
                  </label>
                  <PasswordField
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-600 mb-2">
                    Confirm Password
                  </label>
                  <PasswordField
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-[10px] border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-[10px] bg-gray-900 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <UserPlusIcon />
                  Create Admin Account
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  )
}