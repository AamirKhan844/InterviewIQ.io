import React, { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  FaBriefcase,
  FaChartLine,
  FaFileUpload,
  FaMicrophoneAlt,
  FaUserTie,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import Navbar from "./Navbar";
const Step1Setup = ({ onStart }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisIsDone, setAnalysisIsDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const result = await axios.post(
        "http://localhost:3000/api/v1/user/interview/resume",
        formData,
        { withCredentials: true },
      );
      console.log(result.data);
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setSkills(result.data.skills || []);
      setProjects(result.data.projects || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisIsDone(true);
    } catch (error) {
      console.log(error);
      setAnalyzing(false);
    }
  };
  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        "http://localhost:3000/api/v1/user/interview/generate-questions",
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true },
      );
      console.log(result.data);
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      setLoading(false);
      onStart(result.data);
    } catch (error) {
      console.log(error?.response?.data);
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
      >
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden ">
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative bg-gradient-to-br from-green-50 to-green-200 p-12 flex flex-col justify-center"
          >
            <h1 className="text-4xl font-bold text-gray-600 mb-6">
              Start your AI Interview
            </h1>
            <p className="text-gray-600 mb-10 font-semibold">
              Practice real Interview scenarios powered by{" "}
              <span className="text-red-600">AI</span> . Improve communication,
              techincal skills and confidence{" "}
            </p>
            <div className="space-y-5">
              {[
                {
                  icon: <FaUserTie className="text-green-600 text-xl" />,
                  text: "Chose Role & Experience",
                },
                {
                  icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
                  text: "Smart Voice Interview",
                },
                {
                  icon: <FaChartLine className="text-green-600 text-xl" />,
                  text: "Performance Analytics",
                },
              ].map((item, index) => (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  key={index}
                  className="flex items-center p-4 space-x-4 rounded-xl shadow-sm cursor-pointer bg-white"
                >
                  {item.icon}
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-12 bg-white"
          >
            <h2 className="text-gray-800 mb-10 text-3xl">Interview Setup</h2>
            <div className="space-y-6">
              <div className="relative">
                <FaUserTie className="absolute top-1 left-4 text-gray-400" />
                <input
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                  type="text"
                  placeholder="Enter Role"
                  className="w-full pl-12  pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition"
                />
              </div>
              <div className="relative">
                <FaBriefcase className="absolute top-1 left-4 text-gray-400" />
                <input
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                  type="text"
                  placeholder="Enter Your Experience"
                  className="w-full pl-12  pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition"
                />
              </div>{" "}
              <select
                onChange={(e) => setMode(e.target.value)}
                value={mode}
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 outline-none transition"
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR Interview</option>
              </select>
              {!analysisIsDone && (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  onClick={() =>
                    document.getElementById("resumeUpload").click()
                  }
                  className="border-2 border-dashed border-green-400 rounded-xl p-8 hover:bg-green-50 hover:border-green-600 transition text-center cursor-pointer "
                >
                  <FaFileUpload className="text-2xl text-green-600 mx-auto mb-3" />
                  <input
                    type="file"
                    name=""
                    id="resumeUpload"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <p className="text-gray-600 font-medium">
                    {resumeFile
                      ? resumeFile.name
                      : "Click to upload Resume(optional)"}
                  </p>
                  {resumeFile && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadResume();
                      }}
                      className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      {analyzing ? "Analyzing" : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}
              {analysisIsDone && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.98 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4"
                >
                  <h3 className="text-lg font-semobold text-gray-800">
                    {" "}
                    Resume Analysis Result
                  </h3>
                  {projects.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        Projects:
                      </p>
                      <ul className="list-disc text-gray-600 space-y-1 list-inside">
                        {projects.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1">skills:</p>
                      <ul className="flex flex-wrap gap-2">
                        {skills.map((s, i) => (
                          <li
                            className="bg-green-100 text-green-700 text-sm rounded-lg p-1"
                            key={i}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
              <motion.button
                onClick={handleStart}
                disabled={!role || !experience || loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.9 }}
                className="w-full disabled:bg-gray-600 bg-green-600 text-white py-3 rounded-full text-lg font-semibold transition"
              >
                {loading ? "Starting..." : "Start Interview"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Step1Setup;
