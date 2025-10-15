import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);
  const t = await getTranslations();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">{t("nav.dashboard")}</h1>
      <p className="mt-2 text-neutral-700">{t("dashboard.welcome", { name: session.user?.name ?? "User" })}</p>
    </main>
  );
}
