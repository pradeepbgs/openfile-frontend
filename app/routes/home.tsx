import React from 'react';
import { Shield, Lock, Upload, Download, Users, CheckCircle, ArrowRight, FileText, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router';
import OpenfileLogo from '~/components/openfile-logo';
import Header from '~/components/header';
import Footer from '~/components/footer';
import PlansPage from './dashboard/plan';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Receive Files
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Privately &
              </span>
              <br />
              Securely.
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              OpenFile lets you receive files without revealing personal details. No sign-up needed for senders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={'/dashboard'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                Get Started
              </Link>
              <a href='#how-it-works' className="border-2 border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                How It Works?
              </a>
            </div>
          </div>

          {/* 3D Security Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-80 h-80">
              {/* Folder Base */}
              <div className="absolute top-20 left-10 w-60 h-40 bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg transform rotate-12 shadow-2xl">
                <div className="absolute -top-4 left-8 w-16 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-t-lg"></div>
              </div>

              {/* Security Shield */}
              <div className="absolute top-8 left-24 w-32 h-36 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full transform -rotate-12 shadow-2xl">
                <div className="absolute inset-4 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Lock className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Glow Effects */}
              <div className="absolute top-16 left-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute top-24 left-24 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose OpenFile?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the most secure and private way to share and receive files
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Encryption */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Client-side Encryption</h3>
              <p className="text-gray-300 leading-relaxed">
                Files are encrypted before they leave your device. Only the recipient can decrypt them — not even we can access them.
              </p>
            </div>

            {/* Zero Knowledge */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Zero-Knowledge Privacy</h3>
              <p className="text-gray-300 leading-relaxed">
                You hold the key — literally. We never see your files or decrypt them. You’re in full control.
              </p>
            </div>

            {/* No Account Needed */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Private & Effortless</h3>
              <p className="text-gray-300 leading-relaxed">
                No signup needed. Senders can upload without accounts. Files land securely in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Share files securely in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. Upload Your File</h3>
              <p className="text-gray-300 leading-relaxed">
                Drag and drop or select your file. It's encrypted instantly on your device.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. Share the Link</h3>
              <p className="text-gray-300 leading-relaxed">
                Get a secure link to share with your recipient. No personal details required.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3. Secure Download</h3>
              <p className="text-gray-300 leading-relaxed">
                Recipients download and decrypt files securely. Files expire automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PlansPage />

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Share Files Securely?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust OpenFile for their secure file sharing needs.
          </p>
          <Link to={'/dashboard'} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 rounded-xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;