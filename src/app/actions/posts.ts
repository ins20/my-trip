'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const authorId = formData.get('authorId') as string
  const imageUrl = formData.get('imageUrl') as string

  if (!title || !description || !authorId) {
    return { error: 'Все поля обязательны' }
  }

  await prisma.post.create({
    data: { 
      title, 
      description, 
      authorId,
      imageUrl 
    }
  })

  revalidatePath('/profile')
  revalidatePath('/')
  return { success: true }
} 