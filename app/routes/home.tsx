import type { Route } from "./+types/home";
import Header from "~/components/header";
import { motion } from "framer-motion";
import bg from 'public/bg2.png';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}



const PerfectFor = [
  {
    title: "🎬 Creators",
    description: "Receive video testimonials or content from fans and collaborators securely.",
  },
  {
    title: "🎨 Freelancers",
    description: "Collect design files or assets from clients without messy email threads.",
  },
  {
    title: "🏢 Agencies",
    description: "Get files from clients without asking them to sign up or create accounts.",
  },
  {
    title: "📦 Beta Testers",
    description: "Let testers send bug screenshots, logs, or videos anonymously.",
  },
  {
    title: "🎤 Event Organizers",
    description: "Gather media submissions or speaker videos from contributors.",
  },
  {
    title: "👨‍💼 Recruiters",
    description: "Collect resumes and portfolios from candidates without asking for sign-ups.",
  },
];


const howItWorks = [
  {
    title: "1. Sign Up (Optional)",
    description: "Create an account to manage links and get full access to the dashboard.",
  },
  {
    title: "2. Create a Link",
    description: "Configure your link with limits on file size, types, and upload count.",
  },
  {
    title: "3. Share the Link",
    description: "Send the link to anyone. They don’t need an account to upload files.",
  },
  {
    title: "4. Receive Files",
    description: "View and manage uploads directly from your dashboard securely.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center md:py-10 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <img
              src={bg}
              alt="File Upload Illustration"
              className="rounded-lg w-[90%] max-h-[500px] object-cover"
            />

            <div>
              <motion.h2
                className="text-[2.6rem] font-extrabold text-gray-900"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Private & Anonymous
              </motion.h2>

              <motion.h2
                className="text-[2rem] font-extrabold text-gray-900"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                File Sharing
              </motion.h2>

              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                OpenFile helps you receive files safely without sharing contact details. No sign-up required for uploaders.
              </p>

              <div className="mt-8 flex justify-center items-center space-x-4">
                <a
                  href="/dashboard"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                  Get Started
                </a>
                <a
                  href="#how"
                  className="text-black underline hover:text-gray-800"
                >
                  How it works?
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="py-24 px-4 text-black">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-12">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {howItWorks.map((item, idx) => (
                <div key={idx} className="p-6 border border-gray-600 rounded-lg border-dashed">
                  <h4 className="text-xl font-semibold">{item.title}</h4>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="md:py-10  px-4 text-black">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-12">Perfect For</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {PerfectFor.map((item, idx) => (
                <div key={idx} className="p-6 border border-gray-600 rounded-lg  border-dashed">
                  <h4 className="text-xl font-semibold">{item.title}</h4>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Optional new section */}
        <section className="py-10 px-4 text-black">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-12">Why OpenFile?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="p-6 border border-gray-600 rounded-lg border-dashed">
                <h4 className="text-xl font-semibold">🔐 Private</h4>
                <p className="mt-2 text-gray-600">Your uploads are end-to-end private. Only accessible to you.</p>
              </div>
              <div className="p-6 border border-gray-600 rounded-lg border-dashed">
                <h4 className="text-xl font-semibold">🌐 Anonymous</h4>
                <p className="mt-2 text-gray-600">No login required. Share files without revealing who you are.</p>
              </div>
            </div>
          </div>
        </section>


        {/* Final CTA */}
        <section className="py-24  text-center px-4">
          <h3 className="text-3xl text-black font-bold">Ready to simplify anonymous file sharing?</h3>
          <p className="mt-4 text-gray-600">No accounts, no spam — just simple, secure file transfers.</p>
          <div className="mt-6">
            <a
              href="/auth/register"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Create Your Link
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center text-sm py-6 text-gray-500">
        © {new Date().getFullYear()} OpenFile. Built by spicemen.
      </footer>
    </div>
  )
}
