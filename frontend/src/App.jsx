import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Auth from "./components/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/api/v1/user/current-user",
          { withCredentials: true },
        );
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
      </Routes>
    </>
  );
};

export default App;
