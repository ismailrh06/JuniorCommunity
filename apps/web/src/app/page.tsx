import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HomeContent } from "@/components/home/home-content";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070b16] text-white">
      <Navbar />
      <HomeContent />
      <Footer />
    </main>
  );
}
