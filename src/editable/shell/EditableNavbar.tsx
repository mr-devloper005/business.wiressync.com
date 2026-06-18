'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="relative z-50 bg-white text-[#06131d]">
      <div className="bg-[#111416] text-white">
        <nav className="mx-auto flex min-h-[38px] max-w-[1180px] items-center justify-center gap-5 overflow-x-auto px-4 text-[13px] font-bold">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/create">Write for Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/search" className="inline-flex items-center gap-1.5" aria-label="Open search page">
            <Search className="h-3.5 w-3.5" />
            Search
          </Link>
        </nav>
      </div>

      <div className="mx-auto grid min-h-[150px] max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center border border-black/25 lg:hidden" aria-label="Toggle navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <Link href="/" className="brand-mark max-w-[70vw] text-center" aria-label={SITE_CONFIG.name}>
          <span className="brand-mark__text">{SITE_CONFIG.name}</span>
          <span className="brand-mark__rule" />
        </Link>

        <div className="flex items-center justify-end gap-4">
          {session ? (
            <>
              <button type="button" onClick={logout} className="hidden text-xs font-black uppercase tracking-[.12em] sm:block">Logout</button>
            </>
          ) : <Link href="/login" className="hidden text-xs font-black uppercase tracking-[.12em] sm:block">Log in</Link>}
          <Link href={session ? '/create' : '/signup'} className="hidden bg-[#093C5D] px-4 py-3 text-[10px] font-black uppercase tracking-[.14em] text-white sm:px-6 lg:inline-flex">
            {session ? 'Publish' : 'Subscribe'}
          </Link>
        </div>
      </div>

      {open ? (
        <div className="border-t border-black/15 bg-[var(--slot4-surface-bg)] px-4 py-4 lg:hidden">
          <div className="grid gap-px bg-black/15">
            {[{ label: 'Home', href: '/' }, { label: 'Archive', href: '/search' }, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href} onClick={() => setOpen(false)} className="bg-white px-4 py-3 text-sm font-black uppercase tracking-[.1em]">{item.label}</Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
