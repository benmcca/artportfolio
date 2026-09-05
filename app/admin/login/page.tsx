import LoginForm from "../../../components/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-md rounded-lg border border-sidebar-border bg-sidebar p-8 shadow-lg shadow-black/30">
        <h1 className="mt-4 text-3xl font-bold tracking-[0.08em] text-foreground">
          Admin sign-in
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter your admin email and you&apos;ll receive a secure sign-in link.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
