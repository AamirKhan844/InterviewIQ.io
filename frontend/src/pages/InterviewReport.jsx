import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Step3Report from "../components/Step3Report";
import { API_URL } from "../App/jsx";

const InterviewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(
          `${API_URL}/api/v1/user/interview/report/${id}`,
          { withCredentials: true },
        );
        console.log(result.data);
        setReport(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReport();
  }, [id]);
  return (
    <>
      <Step3Report report={report} />
    </>
  );
};

export default InterviewReport;
