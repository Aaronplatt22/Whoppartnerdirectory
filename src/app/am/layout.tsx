export default function AMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ background: "#facc15", color: "#000", padding: "8px 16px", textAlign: "center" }}>
        AM Dashboard
      </div>
      {children}
    </div>
  );
}
