import React from 'react'
import { motion } from 'framer-motion'
import bg from 'public/bg2.png'
function HeroSection() {
    return (
            <section className="py-10 px-4 bg-gray-100">
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
    )
}

export default React.memo(HeroSection)