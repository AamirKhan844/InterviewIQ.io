import React from "react";
import { FaRobot } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { motion } from "motion/react";
import { auth, provider } from "../utils/fireBase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";

const Auth = () => {
  const dispatch = useDispatch();
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      // console.log(response.user.displayName);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;
      const result = await axios.post(
        "http://localhost:3000/api/v1/user/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6  py-20">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05 }}
          className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white border border-gray-200"
        >
          <div className="flex  items-center justify-center gap-3 mb-6">
            <div className="bg-black text-white rounded-lg p-2">
              <FaRobot size={18} />
            </div>
            <h2 className="font-semibold text-lg  tracking-wide">
              <span className="text-red-500 font-bold">In</span>terview
              <span className="text-red-500 font-bold">IQ</span>.io
            </h2>
          </div>
          <h1 className="text-xl md:text-2xl  text-center font-semibold mb-4">
            Continue With
            <span className="inline-flex bg-green-100 text-green-600 rounded-full px-4 py-2 gap-2">
              <IoSparkles /> AI Smart Interview
            </span>
          </h1>
          <p className="text-sm md:text-lg text-center  text-gray-600 leading-relaxed mb-6 italic">
            Sign-In to{" "}
            <span className="text-red-600 font-semibold">AI Powered</span> Mock
            Interviews, Track your{" "}
            <span className="text-red-600 font-semibold">progress</span> &
            Unlock{" "}
            <span className="text-red-600 font-semibold">
              detailed performance Insights!
            </span>
          </p>
          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ opacity: 0.9, scale: 1.03 }}
            whileTap={{ opacity: 1, scale: 0.9 }}
            className="w-full bg-black text-white flex items-center justify-center gap-3 rounded-xl p-2 cursor-pointer "
          >
            <FcGoogle size={20} /> Login In
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;
