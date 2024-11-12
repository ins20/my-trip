import { login } from '@/actions/auth'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Вход</h1>
      <form
        action={async (formData) => {
          "use server";
          await login(formData);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-2">Имя</label>
          <input
            type="text"
            name="name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Пароль</label>
          <input
            type="password"
            name="password"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Войти
        </button>
      </form>
    </div>
  )
}
