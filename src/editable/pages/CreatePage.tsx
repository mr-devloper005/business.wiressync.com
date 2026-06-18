'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'border border-[#d8e2e6] bg-white px-4 py-3 text-sm font-bold text-[#06131d] outline-none transition placeholder:text-[#6e8793] focus:border-[#3B7597]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-white px-4 py-14 text-[#06131d] sm:px-6 lg:px-0 lg:py-20">
          <section className="mx-auto grid max-w-[1040px] gap-10 border-t border-[#edf1f3] pt-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div className="flex min-h-72 items-center justify-center bg-[#111416] text-white">
              <Lock className="h-20 w-20 text-[#6FD1D7]" />
            </div>
            <div className="self-center">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#3B7597]">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-7xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[#405c6b]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 bg-[#093C5D] px-6 py-3 text-sm font-black text-white transition hover:bg-[#3B7597]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 border border-[#d8e2e6] bg-white px-6 py-3 text-sm font-black transition hover:border-[#3B7597] hover:text-[#3B7597]">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#06131d]">
        <section className="mx-auto max-w-[1160px] px-4 py-14 sm:px-6 lg:px-0 lg:py-20">
          <div className="grid gap-12 border-t border-[#edf1f3] pt-10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#3B7597]">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-7xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[#405c6b]">{pagesContent.create.hero.description}</p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`border p-4 text-left transition ${active ? 'border-[#093C5D] bg-[#093C5D] text-white' : 'border-[#edf1f3] bg-white hover:border-[#6FD1D7] hover:text-[#3B7597]'}`}>
                      <Icon className="h-5 w-5" />
                      <span className="mt-3 block text-sm font-black">{item.label}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-65">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="border border-[#edf1f3] bg-[#f8fcfd] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#3B7597]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="border border-[#d8e2e6] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#405c6b]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 border border-[#3B7597] bg-[#d9fbfa] p-4 text-[#093C5D]">
                  <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#093C5D] px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#3B7597]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
