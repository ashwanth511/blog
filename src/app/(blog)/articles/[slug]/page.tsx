import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Metadata } from 'next'


async function getArticle(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
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
  return client.fetch(query, { slug })
}



export interface PageProps{
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }


}

export default async function ArticlePage({ params}: PageProps) {
  const supabase = createServerComponentClient({ cookies })
  const article = await getArticle(params.slug)
  if (!article || !article.author) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p>The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>

      </div>
    )
  }
  // Get likes from Supabase
  const { data: likes } = await supabase
    .from('article_likes')
    .select('*')
    .eq('article_id', article._id)

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
        <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
        <p>{likes?.length || 0} likes</p>
      </div>
      <div className="prose lg:prose-xl">
        <PortableText value={article.content} />
      </div>
    </div>
  )
}
