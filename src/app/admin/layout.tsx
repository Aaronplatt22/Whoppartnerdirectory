export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ padding: "8px 16px", borderBottom: "1px solid #2a2828" }}>
        Admin
      </div>
      {children}
    </div>
  );
}
