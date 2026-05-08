import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { HiSparkles } from "react-icons/hi";
import Auth from "./Auth";
import AuthMode from "./AuthMode";
import { useNavigate } from "react-router-dom";
import {
  BsBarChart,
  BsClock,
  BsFileEarmarkText,
  BsMic,
  BsRobot,
} from "react-icons/bs";
import evalImg from "../assets/ai-ans.png";
import hrImg from "../assets/HR.png";
import confiImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import historyImg from "../assets/history.png";
import mmImg from "../assets/MM.png";
import pdfImg from "../assets/pdf.png";
import resumeImg from "../assets/resume.png";
import techImg from "../assets/tech.png";
import Footer from "./Footer";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
        <Navbar />
        <div className="flex-1 px-6 py-4 ">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-1">
              <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
                <HiSparkles size={18} className="bg-[#f3f3f3] text-green-600" />{" "}
                <span className="font-bold tracking-wider text-sm md:text-lg">
                  AI Powered{" "}
                  <span className="text-red-600">Smart Interview Platform</span>
                </span>
              </div>
            </div>
            <div className="text-center mb-28">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-semibold max-w-4xl mx-auto leading-tight"
              >
                Ace The <span className="text-red-600">Interview</span> With{" "}
                <span className="relative inline-block ">
                  <span className="bg-green-100 text-green-600 rounded-full px-5 py-1">
                    AI Intelligence !
                  </span>
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-lg  mt-6 text-gray-600 max-w-2xl mx-auto italic"
              >
                Role Based mock <span className="font-bold">Interviews</span>{" "}
                with <span className="font-bold">Smart follow-ups</span> ,
                <span className="font-bold">adaptive difficulty</span> and{" "}
                <span className="font-bold">
                  real-time performance evaluation!!
                </span>
              </motion.p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <motion.button
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true);
                      return;
                    }
                    navigate("/interview");
                  }}
                  whileHover={{ opacity: 0.9, scale: 1.03 }}
                  whileTap={{ opacity: 1.02, scale: 0.9 }}
                  className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90 transition shadow-md cursor-pointer"
                >
                  Start Interview
                </motion.button>
                <motion.button
                  whileHover={{ opacity: 0.9, scale: 1.03 }}
                  whileTap={{ opacity: 1.02, scale: 0.9 }}
                  className=" text-red-600 font-semibold px-6 py-2 rounded-full hover:opacity-90 transition shadow-md cursor-pointer"
                >
                  History
                </motion.button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-15">
              {[
                {
                  icon: <BsRobot size={24} />,
                  step: "Step 1",
                  title: "Role & Experience Selection",
                  desc: "AI Adjusts difficulty based on Selected Job Role",
                },
                {
                  icon: <BsMic size={24} />,
                  step: "Step 2",
                  title: "Smart Voice Interview",
                  desc: "Dunamic follow-up Questions on your answers",
                },
                {
                  icon: <BsClock size={24} />,
                  step: "Step 3",
                  title: "Timer Based Simulation",
                  desc: "Real Interview Pressure with Time tracking ",
                },
              ].map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 + index * 0.2 }}
                  whileHover={{ rotate: 0, scale: 1.06 }}
                  key={index}
                  className={`bg-white relative rounded-3xl border-r border-green-100 hover:border-green-500 p-10 w-80  max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300
                  ${index === 0 ? "rotate-[-4deg]" : ""}
                  ${index === 1 ? "rotate-[3deg] md:mt-6 shadow-xl" : ""}
                  ${index === 2 ? "rotate-[-3deg]" : ""}

                  `}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                    {item.icon}
                  </div>
                  <div className="text-center mt-10">
                    <div className="text-green-600 font-semibold mb-2 tracking-wider">
                      {item.step}
                    </div>
                    <h1 className="text-lg font-semibold tracking-wide mb-3">
                      {item.title}
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center mb-16"
              >
                Advanced AI <span className="text-green-600">Capabilities</span>
              </motion.h2>
              <div className="grid md:grid-cols-2 gap-10 ">
                {[
                  {
                    image: evalImg,
                    icon: <BsBarChart size={18} />,
                    title: "AI Answer Evaluation",
                    desc: "Scores communication, technical accuracy and Confidence",
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={18} />,
                    title: "Resume Based Interview",
                    desc: "Project-specific questions based on uploaded resume",
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={18} />,
                    title: "Downloadable PDF Report",
                    desc: "Detailed Strength, weakness and improvement insights",
                  },
                  {
                    image: mmImg,
                    icon: <BsBarChart size={18} />,
                    title: "History and Analytics",
                    desc: "Track progress with performance graphs and topics analysis",
                  },
                ].map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 + index * 0.2 }}
                    whileHover={{ rotate: 0, scale: 1.06 }}
                    key={index}
                    className="bg-white border borde-gray-200 rounded-3xl p-2 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-1/2 flex justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-64 object-contain w-full"
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <div className="text-green-600 w-12 h-12 rounded-xl flex items-center justify-center  mb-2">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-xl mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center mb-16"
              >
                Multiple Interview <span className="text-green-600">Modes</span>
              </motion.h2>
              <div className="grid md:grid-cols-2 gap-10 ">
                {[
                  {
                    image: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioral and Communication Based Evaluation",
                  },
                  {
                    image: techImg,
                    title: "Technical Mode",
                    desc: "Deep technical Questioning based on Selected Role",
                  },
                  {
                    image: confiImg,
                    title: "Confidence Detection",
                    desc: "Basic tone and voice analysis insights",
                  },
                  {
                    image: creditImg,
                    title: "Credits System",
                    desc: "Unlock premium interview Sessions easily",
                  },
                ].map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 + index * 0.2 }}
                    whileHover={{ rotate: 0, scale: 1.06 }}
                    key={index}
                    className="bg-white border borde-gray-200 rounded-3xl p-2 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-1/2 flex justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-64 object-contain w-full"
                        />
                      </div>
                      <div className="w-full md:w-1/2">
                        <div className="text-green-600 w-12 h-12 rounded-xl flex items-center justify-center  mb-2">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-xl mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {showAuth && <AuthMode onClose={() => setShowAuth(false)} />}
        <Footer />
      </div>
    </>
  );
};

export default Home;
