"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-100 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-teal-600 mb-6"
          >
            Welcome to iPrésencia
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-12"
          >
            Smart Student Attendance Management System
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/etudiant/login" className="inline-block px-8 py-4 bg-gradient-to-r from-teal-300 to-lime-300 text-black rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-teal-400 hover:to-lime-400 transition-all duration-300">
                Student Portal
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/admin/gestionEdt" className="inline-block px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300">
                Admin Portal
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
            <p className="text-gray-600">Monitor student attendance in real-time with our automated system.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-semibold mb-3">Detailed Reports</h3>
            <p className="text-gray-600">Generate comprehensive reports on student attendance patterns.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-semibold mb-3">Intuitive Interface</h3>
            <p className="text-gray-600">A simple and user-friendly interface for efficient management.</p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
