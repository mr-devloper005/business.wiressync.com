import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#06131d]">
        <section className="bg-white">
          <div className="mx-auto max-w-[1160px] px-4 pb-14 pt-16 sm:px-6 lg:px-0 lg:pb-20 lg:pt-24">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#3B7597]">{pagesContent.about.badge}</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-7xl">
              Independent media, built for clear stories.
            </h1>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-16 bg-[#6FD1D7]" />
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#6e8793]">{SITE_CONFIG.name}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1160px] gap-16 border-t border-[#edf1f3] px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,760px)_310px] lg:px-0 lg:py-20">
          <article className="min-w-0">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3B7597]">About {SITE_CONFIG.name}</p>
            <p className="mt-6 text-3xl font-black leading-[1.25] tracking-[-0.035em] sm:text-4xl">{pagesContent.about.description}</p>
            <div className="article-content mt-10 space-y-6">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-12 grid border-y border-[#edf1f3] sm:grid-cols-3">
              {['Directory rhythm', 'Editorial clarity', 'Fast browsing'].map((item, index) => (
                <div key={item} className="border-b border-[#edf1f3] py-5 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3B7597]">0{index + 1}</p>
                  <p className="mt-2 text-sm font-black">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="border-t border-[#6FD1D7]">
            {pagesContent.about.values.map((value, index) => (
              <div key={value.title} className="border-b border-[#edf1f3] py-7 last:border-b-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3B7597]">0{index + 1}</p>
                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em]">{value.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#405c6b]">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>

        <section className="border-y border-[#111416] bg-[#111416] text-white">
          <div className="mx-auto flex max-w-[1160px] flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-0">
            <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">Read the stories shaping the conversation.</h2>
            <Link href="/search" className="inline-flex w-fit bg-[#093C5D] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] transition hover:bg-[#3B7597]">Explore the archive</Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
