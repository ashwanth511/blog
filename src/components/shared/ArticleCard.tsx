'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
interface ArticleCardProps {
  article: {
    title: string
    slug: string
    author: string
    publishedAt: string
    mainImage?: any
  }
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">By {article.author}</p>
        <p className="text-sm text-gray-500">
          {/* {new Date(article.publishedAt).toISOString().split('T')[0]} */}
          {formatDate(article.publishedAt)}
        </p>
      </CardContent>
    </Card>
  )
}
