'use client'

import { useEffect, useState } from 'react'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: any;
  categories?: string[];
  author?: {
    _id: string;
    name?: string;
  };
}

export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserArticles = async () => {
      if (!user?.profile?.id) return

      const query = `*[_type == "post" && author._ref == $userId] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        mainImage,
        "categories": categories[]->title,
        "author": author->
      }`

      try {
        const posts = await client.fetch(query, { userId: user.profile.id })
        setArticles(posts)
      } catch (error) {
        console.error('Error fetching articles:', error)
        toast({
          title: "Error",
          description: "Failed to load articles",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading) {
      if (!user) {
        router.push('/login')
      } else {
        fetchUserArticles()
      }
    }
  }, [user, loading])










  const handleDelete = async (articleId: string) => {
    try {
      await client.delete(articleId)
      setArticles(prev => prev.filter(article => article._id !== articleId))
      
      toast({
        title: "Success",
        description: "Article deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive"
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Articles</h1>
        <Link href="/articles/write">
          <Button>Write New Article</Button>
        </Link>
      </div>
      
      <div className="grid gap-6">
        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No articles yet. Start writing!</p>
        ) : (
          articles.map((article) => (
            <Card key={article._id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Published: {new Date(article.publishedAt).toLocaleDateString()}
                </p>
                {article.categories && (
                  <div className="flex gap-2 mt-2">
                    {article.categories.map((category: string) => (
                      <span key={category} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Link href={`/articles/${article.slug}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(article._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
