import type { Route } from "./+types/home";
import Header from "~/components/header";
import { motion } from "framer-motion";
import bg from 'public/bg2.png';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "OpenFile - Secure Anonymous File Sharing" },
    { name: "description", content: "Receive files securely and anonymously. No signup required for uploaders." },
  ];
}

const PerfectFor = [
  { title: "🎬 Creators", description: "Receive video testimonials or content from fans and collaborators securely." },
  { title: "🎨 Freelancers", description: "Collect design files or assets from clients without messy email threads." },
  { title: "🏢 Agencies", description: "Get files from clients without asking them to sign up or create accounts." },
  { title: "📦 Beta Testers", description: "Let testers send bug screenshots, logs, or videos anonymously." },
  { title: "🎤 Event Organizers", description: "Gather media submissions or speaker videos from contributors." },
  { title: "👨‍💼 Recruiters", description: "Collect resumes and portfolios from candidates without asking for sign-ups." },
];

const howItWorks = [
  { title: "1. Sign Up (Optional)", description: "Create an account to manage links and get full access to the dashboard." },
  { title: "2. Create a Link", description: "Configure your link with limits on file size, types, and upload count." },
  { title: "3. Share the Link", description: "Send the link to anyone. They don’t need an account to upload files." },
  { title: "4. Receive Files", description: "View and manage uploads directly from your dashboard securely." },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <img src={bg} alt="File Upload" className="w-full max-h-[450px] object-cover" />
            </div>
            <div className="text-left">
              <motion.h1
                className="text-3xl md:text-6xl font-extrabold mb-4"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Private & Anonymous
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                OpenFile lets you receive files without sharing personal details. No sign-up needed for senders.
              </motion.p>
              <div className="flex flex-wrap gap-4">
                <a href="/dashboard" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900">Get Started</a>
                <a href="#how" className="px-6 py-3 text-black border border-gray-300 rounded-lg hover:bg-gray-100">How it works?</a>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="py-24 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6 text-left">
              {howItWorks.map((item, idx) => (
                <div key={idx} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                  <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">Perfect For</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {PerfectFor.map((item, idx) => (
                <div key={idx} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                  <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">Why OpenFile?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="text-xl font-semibold mb-2">🔐 Private</h4>
                <p className="text-gray-600">Your uploads are secure and only accessible by you.</p>
              </div>
              <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="text-xl font-semibold mb-2">🌐 Anonymous</h4>
                <p className="text-gray-600">Share files without revealing identity. No account required for uploaders.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-black text-white text-center px-4">
          <h2 className="text-4xl font-bold">Ready to simplify anonymous file sharing?</h2>
          <p className="mt-4 text-lg text-gray-300">No accounts, no spam — just simple, secure file transfers.</p>
          <div className="mt-6">
            <a
              href="/auth/register"
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200"
            >
              Create Your Link
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-center text-sm py-6 text-gray-500">
        © {new Date().getFullYear()} OpenFile. Built by spicemen.
      </footer>
    </div>
  );
}
