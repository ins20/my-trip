import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function uploadImage(file: File) {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Создаем уникальное имя файла
  const filename = `${Date.now()}-${file.name}`
  const path = join(process.cwd(), 'public/uploads', filename)

  // Сохраняем файл
  await writeFile(path, buffer)
  return `/uploads/${filename}`
} 