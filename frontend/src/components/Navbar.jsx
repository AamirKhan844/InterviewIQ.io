import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, scale } from "motion/react";
import { setUserData } from "../redux/userSlice";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import axios from "axios";
import AuthMode from "./AuthMode";

const Navbar = () => {
  const [showCreditpopup, setShowCreditPopup] = useState(false);
  const [showUserpopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/auth/logout",
        {},
        { withCredentials: true },
      );
      navigate("/");

      setShowCreditPopup(false);
      setShowUserPopup(false);
      dispatch(setUserData(null));
      //   showUserpopup(false);
      //   showCreditpopup(false);
    } catch (error) {
      console.log(error);
    }
  };
  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <div className="bg-[#f3f3f3] flex px-2 md:px-4 py-4 md:py-6 ">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl bg-white mx-auto rounded-2xl shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative "
        >
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-black text-white p-2 rounded-lg">
              <BsRobot size={18} />
            </div>
            <motion.h1 className="hidden md:block font-semibold text-lg text-gray-400 tracking-wide ">
              Interview<span className="text-red-600">IQ</span>.IO
            </motion.h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  setShowCreditPopup(!showCreditpopup);
                  setShowUserPopup(false);
                }}
                className="flex items-center gap-2 bg-gray-100 rounded-full py-2 px-4 text-md hover-bg-gray-200 cursor-pointer"
              >
                <BsCoin size={20} />
                {userData?.user?.credits}
              </button>
              {showCreditpopup && (
                <div className="absolute mt-5 shadow-xl bg-white text-gray-600 w-64 p-4 right-[-50px] border border-gray-200 rounded-lg z-50 ">
                  <p className="text-sm md:text-base mb-4 text-gray-600">
                    Need More credits to continue Interviews?
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 1.03 }}
                    onClick={() => navigate("/pricing")}
                    className="w-full bg-black text-white py-2 rounded-lg cursor-pointer"
                  >
                    Buy More Credits!
                  </motion.button>
                </div>
              )}
            </div>
            <div className="relative">
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  setShowUserPopup(!showUserpopup);
                  setShowCreditPopup(false);
                }}
                whileHover={{ rotate: 360, scale: 1.04 }}
                transition={{ duration: 1 }}
                className="flex items-center justify-center bg-black text-white rounded-full w-9 h-9 cursor-pointer"
              >
                {userData ? (
                  userData?.user?.name.slice(0, 1)
                ) : (
                  <FaUserAstronaut />
                )}
              </motion.button>
              {showUserpopup && (
                <div className="absolute mt-6 p-4 w-48 bg-white  shadow-xl border border-gray-200  right-0 rounded-lg z-50 flex flex-col space-y-2 ">
                  <p className="text-md text-blue-600 tracking-wide ">
                    {userData?.user.name}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileFocus={{ scale: 1.03 }}
                    className="w-full bg-black text-white  rounded-lg p-2 mb-2 cursor-pointer"
                  >
                    Interview History
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileFocus={{ scale: 1.03 }}
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white p-2 rounded-lg cursor-pointer "
                  >
                    <HiOutlineLogout className="inline-flex" size={20} /> Logout
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        {showAuth && <AuthMode onClose={() => setShowAuth(false)} />}
      </div>
    </>
  );
};

export default Navbar;
