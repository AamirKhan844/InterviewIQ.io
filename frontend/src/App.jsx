import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Auth from "./components/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import IntreviewPage from "./pages/IntreviewPage";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewReport from "./pages/InterviewReport";
import Pricing from "./components/Pricing";

const App = () => {
  export const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(`${API_URL}/api/v1/user/current-user`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
        console.log(result.data);
      } catch (error) {
        dispatch(setUserData(null));
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/interview" element={<IntreviewPage />}></Route>
        <Route path="/history" element={<InterviewHistory />}></Route>
        <Route path="/report/:id" element={<InterviewReport />}></Route>
        <Route path="/pricing" element={<Pricing />}></Route>
      </Routes>
    </>
  );
};

export default App;
