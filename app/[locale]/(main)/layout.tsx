import { cookies } from "next/headers";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // プレビューモード時はヘッダー・フッターを非表示
  const isPreviewMode = process.env.PREVIEW_MODE === "true";
  if (isPreviewMode) {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("preview_authenticated")?.value === "true";
    if (!isAuthenticated) {
      return <>{children}</>;
    }
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
