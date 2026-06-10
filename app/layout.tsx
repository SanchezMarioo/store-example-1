import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { CartProvider } from '@/lib/cart-context'
import Header from '@/components/Header'
import { getTokenCookie } from '@/lib/cookies'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Forja Urbana',
  description: 'Streetwear urbano',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getTokenCookie()
  const isAuthenticated = Boolean(token)

  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        <CartProvider>
          <Header isAuthenticated={isAuthenticated} />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
