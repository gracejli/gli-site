import "@/app/styling/globals.css"
import Nav from "@/components/Nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-[1400px] mx-auto px-8 md:px-12 font-serif">
        <div className="md:grid md:grid-cols-12 md:min-h-screen">
          <aside className="md:col-span-2 py-8 md:py-12 md:sticky md:top-12 self-start">
            <Nav />
          </aside>

          <main className="md:col-span-8 py-8 md:py-12">
            {children}
          </main>

          <div className="md:col-span-2" />
        </div>
      </body>
    </html>
  );
}
