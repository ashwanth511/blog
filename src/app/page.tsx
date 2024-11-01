import Link from "next/link"
import Image from "next/image"

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Facebook, Linkedin, Instagram, ChevronRight, Search, ShoppingBag, User } from "lucide-react"

async function getArticles() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "author": author->name,
    excerpt
  }`
  return client.fetch(query)
}

export default async function Homepage() {
  const articles = await getArticles()

   
  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">No articles found</h1>
      </div>
    )
  }
  const [featuredArticle, ...restArticles] = articles
  const imageUrl = urlFor(featuredArticle.mainImage).url();
  return (
    <div className="min-h-screen bg-white">
      

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-16 bg-zinc-900 rounded-xl overflow-hidden">
          <div className="p-8 flex flex-col justify-center text-white">
            <div className="space-y-2 mb-8">
              <div className="text-sm">Newest Blog • 2 Min</div>
              <h1 className="text-4xl font-bold">{featuredArticle.title}</h1>
              <p className="text-zinc-300">{featuredArticle.excerpt}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/articles/${featuredArticle.slug}`}>
                <Button variant="secondary" size="sm">Read More</Button>
              </Link>
              <div className="flex items-center gap-2">
                <Image src="/placeholder.svg" alt="Author" width={32} height={32} className="rounded-full" />
                <div className="text-sm">
                  Written by
                  <div className="font-medium">{featuredArticle.author}</div>
                </div>
              </div>
           
            </div>
          </div>
          <div className="relative h-[400px]">
            <Image 
              src={urlFor(featuredArticle.mainImage).url()}
              alt={featuredArticle.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Blogsus</h2>
            <div className="flex-1 max-w-md ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search on Blogsus" className="pl-10 pr-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Top Blogs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {restArticles.slice(0, 3).map((article: { _id: string; slug: string; mainImage: any; author: string; publishedAt: string; title: string }) => (
              <Link key={article._id} href={`/articles/${article.slug}`}>
                <div className="space-y-4">
                  <Image
                    src={urlFor(article.mainImage).url()}
                    alt={`Image for ${article.slug}`}
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-semibold">{article.title}</h3>
                    <div className="flex items-center gap-2">
                      <Image src="/placeholder.svg" alt="Author" width={32} height={32} className="rounded-full" />
                      <div className="text-sm">
                        Written by
                        <div className="font-medium">{article.author}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Latest Blog</h2>
          <div className="grid md:grid-cols-3 gap-8">
          {restArticles.slice(0, 3).map((article: { _id: string; slug: string; mainImage: any; author: string; publishedAt: string; title: string }) => (
              <Link key={article._id} href={`/articles/${article.slug}`}>
            
                <div className="space-y-4">
                  <Image
                    src={urlFor(article.mainImage).url()}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                    <h3 className="font-semibold">{article.title}</h3>
                    <div className="flex items-center gap-2">
                      <Image src="/placeholder.svg" alt="Author" width={24} height={24} className="rounded-full" />
                      <div className="text-sm">
                        Written by
                        <div className="font-medium">{article.author}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-16">
          <Button variant="outline" size="sm">Previous</Button>
          {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
            <Button key={index} variant={page === 1 ? "default" : "outline"} size="sm" className="w-8">
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">Next</Button>
        </div>

        <div className="bg-zinc-900 rounded-xl p-8 text-white mb-16">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-semibold">Ready to Get Our New Stuff?</h2>
            <p className="text-zinc-300">
              We&apos;ll listen to your needs, identify the best approach, and then create a bespoke smart TV charging solution that&apos;s right for you.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Your Email" className="bg-white/10 border-white/20" />
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      </main>

    
    </div>
  )
}
