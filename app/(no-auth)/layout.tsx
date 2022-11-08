export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>Login / Muskrat.club</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
