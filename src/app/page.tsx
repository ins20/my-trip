import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createComment, deleteComment } from "@/actions/comments";
import Image from "next/image";
async function getPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { name: true },
          },
        },
      },
    },
  });
}

async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
}

export default async function HomePage() {
  const posts = await getPosts();
  const currentUser = await getCurrentUser();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Интересные места</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <span className="text-sm text-gray-500">
                Автор: {post.author.name}
              </span>
            </div>

            <p className="mt-2 text-gray-700">{post.description}</p>
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={500}
                height={500}
                className="mt-4 rounded-lg w-full max-h-[400px] object-cover"
              />
            )}
            <div className="mt-4 text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            {/* Секция комментариев */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-4">Комментарии</h3>

              {currentUser && (
                <form
                  action={async (formData) => {
                    "use server";
                    await createComment(formData);
                  }}
                  className="mb-4"
                >
                  <input type="hidden" name="postId" value={post.id} />
                  <input type="hidden" name="authorId" value={currentUser.id} />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="text"
                      placeholder="Написать комментарий..."
                      required
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Отправить
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">
                          {comment.author.name}
                        </span>
                        <p className="mt-1">{comment.text}</p>
                      </div>
                      {currentUser && currentUser.id === comment.authorId && (
                        <form
                          action={async (formData) => {
                            "use server";
                            await deleteComment(formData);
                          }}
                        >
                          <input
                            type="hidden"
                            name="commentId"
                            value={comment.id}
                          />
                          <button
                            type="submit"
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Удалить
                          </button>
                        </form>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
                {post.comments.length === 0 && (
                  <p className="text-gray-500 text-sm">Пока нет комментариев</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-center text-gray-500">Пока нет ни одного поста</p>
        )}
      </div>
    </div>
  );
}
