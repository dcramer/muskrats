import Sidebar from "../../components/sidebar";
import "../../styles/globals.css";
import AuthContext from "./auth-context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext>
      <html lang="en">
        <body>
          <div className="max-w-7xl min-h-screen mx-auto flex">
            <Sidebar />
            <main className="flex-grow border-x-[0.2px] ml-[60px] sm:ml-[70px] md:ml-[100px] lg:ml-[250px] max-w-2xl border-zinc-700">
              {children}

              <p className="container font-xs text-gray text-center mx-auto items-center space-x-2 pt-10 justify-between">
                <span>{"This site is a parody."}</span>
                <span className="font-bold w-16 text-center">&middot;</span>
                <a href="https://github.com/dcramer/muskrats">GitHub</a>
              </p>
            </main>
          </div>
        </body>
      </html>
    </AuthContext>
  );
}
