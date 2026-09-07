import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Admin",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
