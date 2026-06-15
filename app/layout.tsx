import type { Metadata } from 'next'
import { Anton, Epilogue } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCategories } from '@/lib/catalog'
import './globals.css'

const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' })
const epilogue = Epilogue({ subsets: ['latin'], variable: '--font-epilogue' })

export const metadata: Metadata = {
  title: 'GRIETA — Streetwear',
  description: 'Streetwear europeo. Sin temporadas, solo drops.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  return (
    <html lang="es" className={`${anton.variable} ${epilogue.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cement text-ink font-body">
        <Header categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  )
}
