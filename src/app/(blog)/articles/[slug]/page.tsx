
import { formatDate } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

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

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article || !article.author) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p>The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      </div>
    )
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