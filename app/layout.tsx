import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Care Cards",
  description: "Thoughtful cards created with care, creativity, and human touch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
  <Header />
  <main className="min-h-screen">
    {children}
  </main>
  <Footer />
</body>

    </html>
  );
}
