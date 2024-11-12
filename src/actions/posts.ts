'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { uploadImage } from '@/lib/uploadImage'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const authorId = formData.get('authorId') as string
  const image = formData.get('image') as File

  if (!title || !description || !authorId) {
    return { error: 'Все поля обязательны' }
  }

  let imageUrl = null
  if (image && image.size > 0) {
    imageUrl = await uploadImage(image)
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

export async function deletePost(formData: FormData) {
  const postId = formData.get('postId') as string
  
  await prisma.post.delete({
    where: { id: postId }
  })

  revalidatePath('/profile')
  revalidatePath('/')
  return { success: true }
} 