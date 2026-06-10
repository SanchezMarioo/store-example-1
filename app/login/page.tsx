import { getTokenCookie } from '@/lib/cookies'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const token = await getTokenCookie()
  if (token) redirect('/cuenta')

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-white font-black text-3xl uppercase tracking-tight mb-2">
          Iniciar sesión
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          ¿No tienes cuenta?{' '}
          <a href="/registro" className="text-[#c2410c] hover:underline">
            Regístrate
          </a>
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
