// Auth layout — the auth pages manage their own full-canvas layout
// We simply pass children through without the normal header offset
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
