import { RegistrationProvider } from "@/contexts/RegistrationContext";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegistrationProvider>
      <div className="bg-muted flex min-h-svh flex-col">
        <AuthHeader />
        <main className="flex flex-1 flex-col items-center justify-center px-6 md:px-10 py-6 md:py-10">
          {children}
        </main>
        <AuthFooter />
      </div>
    </RegistrationProvider>
  );
}
