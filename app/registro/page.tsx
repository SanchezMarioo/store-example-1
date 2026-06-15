import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTokenCookie } from '@/lib/cookies'
import AuthSidePanel from '@/components/AuthSidePanel'
import RegisterForm from './RegisterForm'

export default async function RegistroPage() {
  const token = await getTokenCookie()
  if (token) redirect('/cuenta')

  return (
    <main className="grid flex-1 lg:grid-cols-2">
      <AuthSidePanel />
      <section className="flex items-center justify-center px-4 py-16 lg:px-8 lg:py-24">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-[1.75rem] uppercase leading-[0.9] tracking-tight text-ink lg:text-h2">
            Crear cuenta
          </h1>
          <p className="mb-8 mt-4 text-zinc-mid">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-bold text-ink underline decoration-acid decoration-2 underline-offset-4 transition duration-150 hover:bg-acid"
            >
              Inicia sesión
            </Link>
          </p>
          <RegisterForm />
        </div>
      </section>
    </main>
  )
}
