import React, { useState } from "react";
// import { useState } from "react";
import { BsDownload } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import html2canvas from "html2canvas";
import "react-circular-progressbar/dist/styles.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const Step3Report = ({ report }) => {
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();
  console.log("report is", report);
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report || {};
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-semibold">
        Loading Report...
      </div>
    );
  }
  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `q${index + 1}`,
    score: score.score || 0,
  }));
  const skills = [
    {
      label: "Confidence",
      value: confidence,
    },
    {
      label: "Communication",
      value: communication,
    },
    {
      label: "Correctness",
      value: correctness,
    },
  ];
  let performanceText = "";
  let shortTagline = "";
  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities";
    shortTagline = "Excellence Clarity and structured responses";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before Interviews";
    shortTagline = "Good foundation,refine articulation";
  } else {
    performanceText = "Significant improvement required";
    shortTagline = "Work on clarity and confidence";
  }
  const score = finalScore;
  const percentage = (score / 10) * 100;
  // const downloadPDF = async () => {
  //   const input = document.getElementById("report-container");

  //   const canvas = await html2canvas(input, {
  //     scale: 2,
  //   });

  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const pdfWidth = pdf.internal.pageSize.getWidth();

  //   const imgWidth = pdfWidth;

  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  //   pdf.save("Interview-Report.pdf");
  // };
  // const downloadPDF = async () => {
  //   console.log("Download clicked");
  //   try {
  //     setDownloading(true);

  //     const input = document.getElementById("report-container");

  //     const canvas = await html2canvas(input, {
  //       scale: 3,
  //       useCORS: true,
  //       backgroundColor: "#ffffff",
  //     });
  //     console.log("Canvas created");

  //     const imgData = canvas.toDataURL("image/png");

  //     const pdf = new jsPDF("p", "mm", "a4");

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();

  //     const imgWidth = pdfWidth;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     let heightLeft = imgHeight;
  //     let position = 0;

  //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  //     heightLeft -= pdfHeight;

  //     while (heightLeft > 0) {
  //       position = heightLeft - imgHeight;

  //       pdf.addPage();

  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  //       heightLeft -= pdfHeight;
  //     }

  //     pdf.save("Interview-Report.pdf");
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setDownloading(false);
  //   }
  // };
  const downloadPDF = () => {
    const pdf = new jsPDF();

    // Heading
    pdf.setFontSize(20);
    pdf.text("Interview Report", 14, 20);

    pdf.setFontSize(12);
    pdf.text(`Final Score: ${finalScore}/10`, 14, 35);
    pdf.text(`Confidence: ${confidence}/10`, 14, 45);
    pdf.text(`Communication: ${communication}/10`, 14, 55);
    pdf.text(`Correctness: ${correctness}/10`, 14, 65);

    // Performance Message
    pdf.setFontSize(14);
    pdf.text("Performance Summary", 14, 85);

    pdf.setFontSize(11);
    pdf.text(performanceText, 14, 95);

    // Question Table
    autoTable(pdf, {
      startY: 110,
      head: [["Question", "Score"]],
      body: questionWiseScore.map((q, i) => [
        q.question || `Question ${i + 1}`,
        `${q.score}/10`,
      ]),
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [16, 185, 129], // emerald
      },
    });

    pdf.save("Interview-Report.pdf");
  };
  return (
    <>
      <div
        id="report-container"
        className="min-h-screen bg-liner-to-br from-gray-50 to-green-100 px-4 sm:px-6 lg:px-10 py-8"
      >
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
          <div className="flex items-start gap-4 mb-5">
            <button
              onClick={() => navigate("/history")}
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
                Interview Analytics Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                AI Powered Interview Insights!
              </p>
            </div>
          </div>
        </div>
        <div className="w-full  ">
          <button
            onClick={downloadPDF}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl px-2 shadow-md text-nowrap w-full flex items-center justify-center gap-3   cursor-pointer mx-auto transition-all duration-300 font-semibold text-sm sm:text-base"
          >
            Download PDF <BsDownload size={18} className="text-gray-50" />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center"
            >
              <h3 className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Overall Performance
              </h3>
              <div className="w-20 h-20 relative  sm:w-25 sm:h-25 mx-auto">
                <CircularProgressbar
                  value={percentage}
                  text={`${score}/10`}
                  styles={buildStyles({
                    textSize: "22px",
                    pathColor: "#10b981",
                    trailColor: "#ef444",
                    textColor: "#10b981",
                  })}
                />
              </div>

              <p className="text-gray-400 mt-3 text-xs sm:text-sm">out of 10</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-600 text-sm sm:text-base">
                  {performanceText}
                </p>
                <p className="text-gray-500 mt-1 text-xs sm:text-sm">
                  {shortTagline}
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8"
            >
              <h3 className="text-gray-600 mb-6 font-semobold text-sm sm:text-lg">
                Skill Evaluation
              </h3>
              <div className="space-y-5">
                {skills.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2 text-sm sm:text-base">
                      <span>{item.label}</span>
                      <span className="text-green-600 font-semibold ">
                        {item.value}
                      </span>
                    </div>
                    <div className="rounded-full h-2 bg-gray-200 sm:h-3">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${item.value * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg  p-5 sm:p-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">
                Performance Trend
              </h3>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionScoreData}>
                    <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#22c55e"
                      fill="#bbf7d0"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-700  mb-6">
                Question Breakdown
              </h3>
              <div className="space-y-6">
                {questionWiseScore.map((q, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-4 sm:p-6 flex items-center justify-between rounded-xl sm:rounded-2xl border border-gray-200"
                  >
                    <div>
                      <p className="text-gray-400 text-xs">
                        {" "}
                        Question {i + 1}{" "}
                      </p>
                      <p className="font-semibold text-sm sm:text-base leading-relaxed tracking-wide">
                        {q.question || "Question not available"}
                      </p>
                    </div>
                    <div className="w-fit bg-green-100 text-green-600  rounded-full font-bold">
                      {q.score ?? 0}/10
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step3Report;
