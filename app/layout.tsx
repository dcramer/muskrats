import Sidebar from "../components/sidebar";
import "../styles/globals.css";
import AuthContext from "./auth-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContext>
      <html lang="en">
        <body>
          <div className="max-w-7xl min-h-screen mx-auto flex ">
            <Sidebar />
            <main className="flex-grow border-x-[0.2px] ml-[60px] sm:ml-[70px] md:ml-[100px] lg:ml-[250px] max-w-2xl border-zinc-700 ">
              {children}
            </main>
          </div>
        </body>
      </html>
    </AuthContext>
  );
}
