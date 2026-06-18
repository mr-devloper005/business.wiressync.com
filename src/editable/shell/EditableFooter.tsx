'use client'

import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[#edf1f3] bg-white text-[#06131d]">
      <div className="mx-auto max-w-[1160px] px-4 py-16 sm:px-6 lg:px-0 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="text-4xl font-black tracking-[-.04em]">About</h2>
            <p className="mt-16 max-w-[270px] text-base leading-8">
              {globalContent.footer?.description || `${SITE_CONFIG.name} gathers timely business updates, market notes, and media distribution items for quick public reading.`}
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-black tracking-[-.04em]">Contact Us</h2>
            <div className="mt-16 text-sm leading-7">
              <form action="/search" className="mt-16">
                <label htmlFor="footer-search" className="block text-sm font-black">Search</label>
                <div className="mt-1 flex">
                  <input id="footer-search" name="q" type="search" className="h-[50px] min-w-0 border border-[#d8e2e6] px-3 outline-none focus:border-[#3B7597]" />
                  <button className="h-[50px] bg-[#111416] px-5 text-sm font-black uppercase tracking-[.04em] text-white">Search</button>
                </div>
              </form>
              {session ? <button onClick={logout} className="mt-6 text-sm font-black hover:text-[#3B7597]">Logout</button> : null}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#edf1f3] pt-6 text-sm">
          Copyright © {year}. All rights reserved. Theme: {SITE_CONFIG.name}. Powered by public media distribution.
        </div>
      </div>
      <a href="#top" className="fixed bottom-8 right-6 hidden origin-center rotate-[-90deg] items-center gap-3 text-sm font-semibold text-[#59636a] lg:flex">
        <span className="rotate-90 text-3xl leading-none">↑</span> Back To Top
      </a>
    </footer>
  )
}
