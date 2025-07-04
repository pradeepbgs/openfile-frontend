import type { Route } from "./+types/home";
import Header from "~/components/header";
import { motion } from "framer-motion";
import Footer from "~/components/footer";
import HeroSection from "~/components/hero-section";
import HowItWorks from "~/components/how-it-works";
import Features from "~/components/features";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "OpenFile - Secure Anonymous File Sharing" },
    { name: "description", content: "Receive files securely and anonymously. No signup required for uploaders." },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <Features />

        {/* Final CTA */}
        <section className="py-24 bg-black text-white text-center px-4">
          <h2 className="text-4xl font-bold">Ready to simplify anonymous file sharing?</h2>
          <p className="mt-4 text-lg text-gray-400">No accounts, no spam — just simple, secure file transfers.</p>
          <div className="mt-6">
            <a
              href="/auth/register"
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Create Your Link
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
