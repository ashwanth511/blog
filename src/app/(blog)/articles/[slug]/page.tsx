import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause, Square, Grid } from "lucide-react"
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

async function getArticle(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    content,
    publishedAt,
    mainImage,
    "author": author->{
      name,
      email
    },
    "likes": count(*[_type == "like" && article._ref == ^._id])
  }`
  try {
    return await client.fetch(query, { slug })
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params
  const article = await getArticle(resolvedParams.slug)

  if (!article || !article.author) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        {/* Your existing header code */}
      </header>

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-lg text-gray-600 mb-8">
              By {article.author.name} • {formatDate(article.publishedAt)} 
            </p>
          </div>

          <div className="relative mb-12">
            <Image
              src={urlFor(article.mainImage).url()}
              alt={article.title}
              layout="responsive"
              width={800} // set a default width
              height={600} 
              className="rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon"><Play className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Pause className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Square className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Grid className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <aside className="md:col-span-1">
              <nav className="space-y-2 sticky top-4">
                {/* Your existing navigation links */}
              </nav>
            </aside>

            <div className="md:col-span-3">
              <div className="prose max-w-none">
                <PortableText value={article.content} />
              </div>
            </div>
          </div>
        </article>
      </main>

      <section className="bg-zinc-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">10x your growth with Untitled</h2>
          <p className="mb-8">Join over 50,000+ designers already growing with Untitled.</p>
          <Button size="lg" variant="secondary">Download template</Button>
        </div>
      </section>
    </div>
  )
}
