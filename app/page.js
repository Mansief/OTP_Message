export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          OTP Auth
        </p>
        <h1 className="text-3xl font-bold text-zinc-900">Secure account access</h1>
        <p className="mt-3 text-zinc-600">
          Register with your phone number or sign in to continue.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/login"
            className="flex h-12 flex-1 items-center justify-center rounded-lg bg-zinc-900 px-5 font-semibold text-white transition hover:bg-zinc-700"
          >
            Log in
          </a>
          <a
            href="/register"
            className="flex h-12 flex-1 items-center justify-center rounded-lg border border-zinc-300 px-5 font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Create account
          </a>
        </div>
      </section>
    </main>
  );
}
