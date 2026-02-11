import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "PT Maju Jaya",
  version: packageJson.version,
  copyright: `© ${currentYear}, PT Maju Jaya.`,
  meta: {
    title: "PT Maju Jaya - Modern Next.js Dashboard Starter Template",
    description:
      "PT Maju Jaya is a modern, open-source dashboard starter template built with Next.js 16, Tailwind CSS v4, and shadcn/ui. Perfect for SaaS apps, admin panels, and internal tools—fully customizable and production-ready.",
  },
};
