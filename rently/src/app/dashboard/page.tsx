import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome, {session.user?.name ?? session.user?.email}</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/signin" });
        }}
      >
        <button
          type="submit"
          className="mt-4 inline-flex items-center rounded bg-gray-900 px-4 py-2 text-white hover:opacity-90"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
