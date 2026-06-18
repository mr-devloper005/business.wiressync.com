import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#06131d]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1160px] px-4 py-14 sm:px-6 lg:grid-cols-[430px_minmax(0,1fr)] lg:gap-16 lg:px-0 lg:py-20">
          <div className="flex flex-col justify-center border-t border-[#6FD1D7] bg-white py-8 lg:py-0">
            <div className="border border-[#edf1f3] bg-[#f8fcfd] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#3B7597]">Create account</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-5 border-t border-[#d8e2e6] pt-5 text-sm text-[#405c6b]">Already have an account? <Link href="/login" className="font-black text-[#3B7597] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
            </div>
          </div>
          <div className="flex flex-col justify-center border-t border-[#edf1f3] py-8 lg:py-0">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#3B7597]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-7xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[#405c6b]">{pagesContent.auth.signup.description}</p>
            <div className="mt-10 bg-[#111416] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#6FD1D7]">Distribution desk</p>
              <p className="mt-4 max-w-lg text-2xl font-black leading-tight tracking-[-0.03em]">Create once, then keep moving through the archive with a cleaner account flow.</p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
