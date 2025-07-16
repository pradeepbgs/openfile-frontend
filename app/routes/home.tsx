import type { Route } from "./+types/home";
import Header from "~/components/header";
import { motion } from "framer-motion";
import Footer from "~/components/footer";
import HeroSection from "~/components/hero-section";
import HowItWorks from "~/components/how-it-works";
import Features from "~/components/features";
import PlansPage from "./dashboard/plan";
import { FaLock, FaShareAlt, FaUpload, FaUserSecret } from "react-icons/fa";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "OpenFile - Secure Anonymous File Sharing" },
    { name: "description", content: "Receive files securely and anonymously. No signup required for uploaders." },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f16] text-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        {/* Features */}
        <section id="features" className="bg-slate-800 py-16 px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Why OpenFile?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <FaLock className="mx-auto text-blue-500 text-3xl mb-3" />
              <h4 className="font-semibold text-lg mb-2">Zero-Knowledge</h4>
              <p className="text-slate-300 text-sm">Only you hold the decryption key. Even we can't read your files.</p>
            </div>
            <div>
              <FaUserSecret className="mx-auto text-blue-500 text-3xl mb-3" />
              <h4 className="font-semibold text-lg mb-2">Private Upload Links</h4>
              <p className="text-slate-300 text-sm">Create links that expire or allow one-time use, securely.</p>
            </div>
            <div>
              <FaShareAlt className="mx-auto text-blue-500 text-3xl mb-3" />
              <h4 className="font-semibold text-lg mb-2">Controlled Sharing</h4>
              <p className="text-slate-300 text-sm">Others can upload, but can’t view or download what they sent.</p>
            </div>
            <div>
              <FaUpload className="mx-auto text-blue-500 text-3xl mb-3" />
              <h4 className="font-semibold text-lg mb-2">Simple & Secure</h4>
              <p className="text-slate-300 text-sm">No signup needed to upload. Files go directly to your dashboard.</p>
            </div>
          </div>
        </section>
        {/* <Features /> */}
        <HowItWorks />

        <PlansPage />
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
