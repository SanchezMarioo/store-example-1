import { getTokenCookie } from '@/lib/cookies'
import { redirect } from 'next/navigation'
import RegisterForm from './RegisterForm'

export default async function RegistroPage() {
  const token = await getTokenCookie()
  if (token) redirect('/cuenta')

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-white font-black text-3xl uppercase tracking-tight mb-2">
          Crear cuenta
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-[#c2410c] hover:underline">
            Inicia sesión
          </a>
        </p>
        <RegisterForm />
      </div>
    </main>
  )
}
