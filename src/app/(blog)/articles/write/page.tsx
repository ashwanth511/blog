'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Category {
  _id: string;
  title: string;
}

const getCategories = async () => {
  const query = `*[_type == "category"]{
    _id,
    title
  }`
  return client.fetch(query)
}




export default function WritePage() {
  const { user} = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
const [IsLoading,setIsLoading]=useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])
  
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }


  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.profile?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      })
      return
    }

    try {
      const authorDoc = {
        _type: 'author',
        _id: user.profile.id,
        name: user.profile.name,
        email: user.profile.email
      }

      await client.createIfNotExists(authorDoc)

      const imageAssets = await Promise.all(
        images.map(image => client.assets.upload('image', image))
      )

      const doc = {
        _type: 'post',
        title,
        slug: {
          _type: 'slug',
          current: title.toLowerCase().replace(/\s+/g, '-')
        },
        content: [{
          _type: 'block',
          children: [{ _type: 'span', text: content }],
          _key: crypto.randomUUID()
        }],
        categories: selectedCategory ? [{
          _type: 'reference',
          _ref: selectedCategory,
          _key: crypto.randomUUID()
        }] : [],
        images: imageAssets.map(asset => ({
          _type: 'image',
          asset: {
            _type: "reference",
            _ref: asset._id
          },
          _key: crypto.randomUUID()
        })),
        mainImage: imageAssets[0] ? {
          _type: 'image',
          asset: {
            _type: "reference",
            _ref: imageAssets[0]._id
          }
        } : null,
        author: {
          _type: 'reference',
          _ref: user.profile.id
        },
        publishedAt: new Date().toISOString()
      }

      await client.create(doc)
      toast({
        title: "Success!",
        description: "Your article has been published.",
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Publishing error:', error)
      toast({
        title: "Error",
        description: "Failed to publish article.",
        variant: "destructive"
      })
    }
  }
  if(IsLoading){

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <Card>
        <CardHeader>
          <CardTitle>Write Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className="w-full justify-between"
                >
                  {selectedCategory
                    ? categories.find((cat) => cat._id === selectedCategory)?.title
                    : "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category._id}
                          value={category._id}
                          onSelect={(currentValue) => {
                            setSelectedCategory(currentValue === selectedCategory ? "" : currentValue)
                            setCategoryOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategory === category._id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {category.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImagesChange}
                className="mb-2"
                multiple
              />
              <div className="grid grid-cols-2 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Textarea
                placeholder="Write your article content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Publish Article
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
}
