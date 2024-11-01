import Link from "next/link"
import Image from "next/image"

import { client } from '@/sanity/lib/client'
  export default function Footer(){
  return (
  <footer className="bg-white border-t">
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
      <div className="space-y-4">
        <h3 className="font-semibold">Product</h3>
        <nav className="flex flex-col space-y-2 text-sm text-gray-600">
          <Link href="#">Overview</Link>
          <Link href="#">Features</Link>
          <Link href="#">Solutions</Link>
          <Link href="#">Tutorials</Link>
          <Link href="#">Releases</Link>
        </nav>
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">Company</h3>
        <nav className="flex flex-col space-y-2 text-sm text-gray-600">
          <Link href="#">About us</Link>
          <Link href="#">Careers</Link>
          <Link href="#">Press</Link>
          <Link href="#">News</Link>
          <Link href="#">Contact</Link>
        </nav>
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">Resources</h3>
        <nav className="flex flex-col space-y-2 text-sm text-gray-600">
          <Link href="#">Blog</Link>
          <Link href="#">Events</Link>
          <Link href="#">Help centre</Link>
          <Link href="#">Tutorials</Link>
          <Link href="#">Support</Link>
        </nav>
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">Use cases</h3>
        <nav className="flex flex-col space-y-2 text-sm text-gray-600">
          <Link href="#">Startups</Link>
          <Link href="#">Enterprise</Link>
          <Link href="#">Government</Link>
          <Link href="#">SaaS</Link>
          <Link href="#">Marketplaces</Link>
        </nav>
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">Social</h3>
        <nav className="flex flex-col space-y-2 text-sm text-gray-600">
          <Link href="#">Twitter</Link>
          <Link href="#">LinkedIn</Link>
          <Link href="#">Facebook</Link>
          <Link href="#">GitHub</Link>
          <Link href="#">AngelList</Link>
        </nav>
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">Legal</h3>
        <nav className="flex flex-col space-y-2 text-sm text-gray-600">
          <Link href="#">Terms</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Cookies</Link>
          <Link href="#">Licenses</Link>
          <Link href="#">Contact</Link>
        </nav>
      </div>
    </div>
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t text-sm text-gray-600">
      <div>© 2024 Untitled UI. All rights reserved.</div>
      <div className="flex gap-4">
        <Link href="#">Terms</Link>
        <Link href="#">Privacy</Link>
        <Link href="#">Cookies</Link>
      </div>
    </div>
  </div>
</footer>
  )}