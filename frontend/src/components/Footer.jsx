import React from "react";
import { BsRobot, BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-black text-white p-2 rounded-xl">
                <BsRobot size={18} />
              </div>

              <h2 className="font-semibold text-lg tracking-wide">
                Interview<span className="text-red-600">IQ</span>.IO
              </h2>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              AI Powered Interview preparation platform with smart evaluation,
              adaptive questioning and detailed performance insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>

            <div className="flex flex-col gap-3 text-gray-600 text-sm">
              <button className="hover:text-green-600 transition text-left cursor-pointer">
                Home
              </button>

              <button className="hover:text-green-600 transition text-left cursor-pointer">
                Interview
              </button>

              <button className="hover:text-green-600 transition text-left cursor-pointer">
                Pricing
              </button>

              <button className="hover:text-green-600 transition text-left cursor-pointer">
                History
              </button>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Features</h3>

            <div className="flex flex-col gap-3 text-gray-600 text-sm">
              <p>AI Evaluation</p>
              <p>Voice Interviews</p>
              <p>Resume Based Questions</p>
              <p>Performance Analytics</p>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>

            <div className="flex items-center gap-4">
              {[
                <BsGithub size={20} />,
                <BsLinkedin size={20} />,
                <BsTwitterX size={20} />,
              ].map((icon, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-gray-100 hover:bg-black hover:text-white transition w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © 2026 InterviewIQ.IO — All Rights Reserved
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="hover:text-green-600 transition cursor-pointer">
              Privacy Policy
            </button>

            <button className="hover:text-green-600 transition cursor-pointer">
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
