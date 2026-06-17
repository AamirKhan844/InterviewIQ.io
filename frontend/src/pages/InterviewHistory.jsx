import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  import { API_URL } from "../App/jsx";

  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterview = async () => {
      try {
        const result = await axios.get(
          `${API_URL}/api/v1/user/interview/interviews`,
          {
            withCredentials: true,
          },
        );

        setInterviews(result.data?.interviews || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load interview history.");
      } finally {
        setLoading(false);
      }
    };

    getMyInterview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fbf8]">
        <div className="text-lg font-medium text-gray-600">
          Loading interviews...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fbf8] py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="
              h-12
              w-12
              rounded-full
              bg-white
              shadow-sm
              hover:shadow-md
              flex
              items-center
              justify-center
              transition
            "
          >
            <FaArrowLeft className="text-gray-700" />
          </button>

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Interview History
            </h1>

            <p className="text-gray-500 mt-2">
              Track your past interviews and performance reports
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && interviews.length === 0 && (
          <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
            <p className="text-gray-500 text-lg">
              No interviews found. Start your first interview.
            </p>
          </div>
        )}

        {/* Interview Cards */}
        <div className="space-y-6">
          {interviews.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/report/${item._id}`)}
              className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Side */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">
                    {item.role}
                  </h3>

                  <p className="text-gray-500 mt-2 text-sm">
                    {item.experience} year
                    {item.experience > 1 ? "s" : ""} • {item.mode}
                  </p>

                  <p className="text-gray-400 text-sm mt-2">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p
                      className={`text-3xl font-bold ${
                        item.finalScore >= 8
                          ? "text-emerald-500"
                          : item.finalScore >= 5
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      {item.finalScore.toFixed(2) || 0}/10
                    </p>

                    <p className="text-xs text-gray-400">Overall Score</p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-medium ${
                      item.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewHistory;
