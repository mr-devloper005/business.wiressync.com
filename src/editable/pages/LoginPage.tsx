import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#06131d]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1160px] px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-16 lg:px-0 lg:py-20">
          <div className="flex flex-col justify-center border-t border-[#edf1f3] py-8 lg:py-0">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#3B7597]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-7xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[#405c6b]">{pagesContent.auth.login.description}</p>
            <div className="mt-10 grid max-w-2xl gap-0 border-y border-[#edf1f3] text-sm sm:grid-cols-3">
              {['Fast access', 'Saved publishing', 'Clean archive'].map((item, index) => (
                <div key={item} className="border-b border-[#edf1f3] py-5 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3B7597]">0{index + 1}</p>
                  <p className="mt-2 font-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center border-t border-[#6FD1D7] bg-white py-8 lg:py-0">
            <div className="border border-[#edf1f3] bg-[#f8fcfd] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#3B7597]">Member access</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 border-t border-[#d8e2e6] pt-5 text-sm text-[#405c6b]">New here? <Link href="/signup" className="font-black text-[#3B7597] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
