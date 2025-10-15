import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations();
  const isRTL = locale === "ar";
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-4">
        <h1 className="text-3xl font-bold">{t("hero.title")}</h1>
        <p className="text-neutral-600">{t("hero.subtitle")}</p>
        <div className="flex gap-3 justify-center">
          <Link href={`/${locale}/login`} className="px-4 py-2 bg-black text-white rounded">
            {t("nav.login")}
          </Link>
          <Link href={`/${locale}/dashboard`} className="px-4 py-2 border rounded">
            {t("nav.dashboard")}
          </Link>
        </div>
        <div className="mt-6">
          <Link href={isRTL ? "/en" : "/ar"} className="underline">
            {isRTL ? "Switch to English" : "التبديل إلى العربية"}
          </Link>
        </div>
      </div>
    </main>
  );
}
