import { formatDate } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
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
    <div className="container mx-auto py-8 max-w-3xl">
      {article.mainImage && (
        <img
          src={urlFor(article.mainImage).url()}
          alt={article.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <div className="text-gray-600 mb-8">
        <p>By {article.author.name}</p>
        <p>{formatDate(article.publishedAt)}</p>
        <p>{article.likes} likes</p>
      </div>
      <div className="prose lg:prose-xl">
        <PortableText value={article.content} />
      </div>
    </div>
  )
}