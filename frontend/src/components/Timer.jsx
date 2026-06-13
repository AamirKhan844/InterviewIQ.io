import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Timer = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  return (
    <>
      <div className="w-20 h-20">
        <CircularProgressbar
          value={percentage}
          text={`${timeLeft}sec`}
          styles={buildStyles({
            textSize: "28px",
            pathColor: "#10b981",
            trailColor: "#ef444",
            textColor: "#10b981",
          })}
        />
      </div>
    </>
  );
};

export default Timer;
