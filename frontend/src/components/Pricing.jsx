import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-100 py-16 px-6">
        <div className="max-w-6xl mx-auto mb-14 flex items-start gap-4">
          <button
            className="mt-2 p-3 rounded-full bg-white shadow-md hover:shadow-lg transition"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft className="text-gray-600" size={18} />
          </button>
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold text-gray-800">
              Choose Your Plan!
            </h1>
            <p className="mt-2 text-lg text-gray-500 font-semibold tracking-wider">
              Flexible Pricing to match your Interview preparation goals
            </p>
          </div>
        </div>
        <div className="text-6xl font-bold text-center tracking-wider leading-relaxed ">
          This Feature is under Maintanace.Kindly Enjoy your free 1000 Credits!
        </div>
      </div>
    </>
  );
};

export default Pricing;
