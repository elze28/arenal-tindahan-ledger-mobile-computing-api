import { login, signup } from "./actions";

export default function LoginPage() {
  async function loginAction(formData: FormData) {
    "use server";

    await login(formData);
  }

  async function signupAction(formData: FormData) {
    "use server";

    await signup(formData);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">
        Sign in to Tindahan Ledger
      </h1>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block font-medium"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block font-medium"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            formAction={loginAction}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Sign in
          </button>

          <button
            formAction={signupAction}
            className="rounded border px-4 py-2"
          >
            Sign up
          </button>
        </div>
      </form>
    </main>
  );
}