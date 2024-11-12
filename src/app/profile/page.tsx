import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createPost, deletePost } from "@/actions/posts";
import Image from "next/image";
async function getUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-8">
      {user && (
        <>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Добавить место</h2>
            <form
              action={async (formData) => {
                "use server";
                await createPost(formData);
              }}
              className="space-y-4"
            >
              <input type="hidden" name="authorId" value={user.id} />
              <div>
                <label className="block mb-2">Заголовок</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Описание</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Изображение</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Создать
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Мои посты</h2>
            <div className="space-y-4">
              {user.posts.map((post) => (
                <div key={post.id} className="border p-4 rounded">
                  <h3 className="font-bold">{post.title}</h3>
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={500}
                      height={500}
                      className="mt-2 rounded-lg max-h-[200px] object-cover"
                    />
                  )}
                  <p className="mt-2">{post.description}</p>
                  <form
                    action={async (formData) => {
                      "use server";
                      await deletePost(formData);
                    }}
                    className="mt-2"
                  >
                    <input type="hidden" name="postId" value={post.id} />
                    <button
                      type="submit"
                      className="text-red-500 hover:text-red-700"
                    >
                      Удалить
                    </button>
                  </form>
                </div>
              ))}
              {user.posts.length === 0 && (
                <p className="text-gray-500">У вас пока нет постов</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
