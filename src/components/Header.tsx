import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { logout } from '@/actions/auth'

async function getUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null
  
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true }
  })
}

export async function Header() {
  const user = await getUser()

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MyTrip
        </Link>
        
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/profile" className="hover:text-gray-300">
                {user.name}
              </Link>
              <form action={logout}>
                <button type="submit" className="hover:text-gray-300">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Вход
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
