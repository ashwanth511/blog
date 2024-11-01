'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/supabase'
import { User, AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { client } from '@/sanity/lib/client'

type Profile = {
  id: string;
  name: string;
  email: string;
}
type UserWithProfile = User & { profile: Profile }
type AuthContextType = {
  user: UserWithProfile | null;
  login: (email: string, password: string) => Promise<{
    data: { user: UserWithProfile | null } | null;
    error: AuthError | null;
  }>;
  signup: (email: string, password: string, name: string) => Promise<{
    data: { user: UserWithProfile | null } | null;
    error: AuthError | null;
  }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser({ ...session.user, profile })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser({ ...session.user, profile })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      const userWithProfile = {...data.user, profile: profileData}
      setUser(userWithProfile)

      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      await router.push('/dashboard')
      return { data: { user: userWithProfile }, error: null }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      })
      return { data: null, error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }
  const signup = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })
  
      if (error) throw error
  
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email
          })
  
        if (profileError) throw profileError
  
        await client.create({
          _type: 'author',
          _id: data.user.id,
          name,
          email,
        })
  
        const userWithProfile = {
          ...data.user,
          profile: {
            id: data.user.id,
            name,
            email
          }
        }
  
        toast({
          title: "Success",
          description: "Account created successfully. Please verify your email.",
        })
        
        router.push('/dashboard')
        return { data: { user: userWithProfile }, error: null }
      }
  
      return { data: { user: null }, error: null }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      })
      return { data: null, error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }




  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
