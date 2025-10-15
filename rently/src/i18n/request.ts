import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const loc = (locale ?? "en") as string;
  return {
    locale: loc,
    messages: (await import(`./messages/${loc}.json`)).default,
  };
});
