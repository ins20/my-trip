'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createComment(formData: FormData) {
  const text = formData.get('text') as string
  const postId = formData.get('postId') as string
  const authorId = formData.get('authorId') as string

  if (!text || !postId || !authorId) {
    return { error: 'Все поля обязательны' }
  }

  await prisma.comment.create({
    data: { text, postId, authorId }
  })

  revalidatePath('/')
  return { success: true }
}

export async function deleteComment(formData: FormData) {
  const commentId = formData.get('commentId') as string
  
  await prisma.comment.delete({
    where: { id: commentId }
  })

  revalidatePath('/')
  return { success: true }
} 