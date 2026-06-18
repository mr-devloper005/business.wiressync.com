import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''

const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}

const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const wide = index % 4 === 0

  return (
    <Link href={href} className={`group grid overflow-hidden border border-[#edf1f3] bg-white transition hover:border-[#6FD1D7] hover:shadow-[0_18px_45px_rgba(9,60,93,.08)] ${wide ? 'lg:grid-cols-[260px_minmax(0,1fr)]' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-[#e7f7f8] ${wide ? 'min-h-[220px] lg:h-full' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06131d]/60 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 bg-[#093C5D] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        {!image ? <span className="bg-[#093C5D] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">{taskLabel}</span> : null}
        <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#3B7597]">Result {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-[1.08] tracking-[-0.035em] text-[#06131d]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-[#405c6b]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#6e8793] group-hover:text-[#3B7597]">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#06131d]">
        <section className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-0 lg:py-20">
          <div className="grid gap-10 border-t border-[#edf1f3] pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#3B7597]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-7xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[#405c6b]">{pagesContent.search.hero.description}</p>
            </div>

            <form action="/search" className="border border-[#edf1f3] bg-[#f8fcfd] p-5 sm:p-7">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 border border-[#d8e2e6] bg-white px-4 py-3 focus-within:border-[#3B7597]">
                <Search className="h-5 w-5 text-[#3B7597]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold text-[#06131d] outline-none placeholder:text-[#6e8793]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 border border-[#d8e2e6] bg-white px-4 py-3 focus-within:border-[#3B7597]">
                  <Filter className="h-4 w-4 text-[#3B7597]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#06131d] outline-none placeholder:text-[#6e8793]" />
                </label>
                <select name="task" defaultValue={task} className="border border-[#d8e2e6] bg-white px-4 py-3 text-sm font-black text-[#06131d] outline-none focus:border-[#3B7597]">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center border border-[#093C5D] bg-[#093C5D] px-6 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:border-[#3B7597] hover:bg-[#3B7597]" type="submit">Search</button>
            </form>
          </div>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-y border-[#edf1f3] py-7">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#6e8793]">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 border border-[#d8e2e6] bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#06131d] transition hover:border-[#3B7597] hover:text-[#3B7597]">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-[#b9d4dc] bg-[#f8fcfd] p-10 text-center">
              <p className="text-2xl font-black tracking-[-0.04em] text-[#06131d]">No matching posts found.</p>
              <p className="mt-3 text-sm font-semibold text-[#405c6b]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
