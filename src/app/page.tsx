import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import ArticleCard from '@/components/shared/ArticleCard'

async function getArticles() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "author": author->name
  }`
  return client.fetch(query)
}

export default async function Homepage() {
  const articles = await getArticles()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: any) => (
          <Link key={article._id} href={`/articles/${article.slug}`}>
            <ArticleCard article={article} />
          </Link>
        ))}
      </div>
    </div>
  )
}
