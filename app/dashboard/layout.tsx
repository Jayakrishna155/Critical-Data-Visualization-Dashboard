export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <header className="header">
        <div className="row">
          <strong>Performance Dashboard</strong>
          <span className="pill">Next.js App Router</span>
          <span className="pill">Canvas + SVG</span>
        </div>
        <div className="row">
          <a className="button ghost" href="/">Home</a>
        </div>
      </header>
      {children}
    </div>
  );
}


