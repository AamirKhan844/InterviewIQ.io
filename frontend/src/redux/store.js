import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
// import { counterSlice } from "./counterSlice.js";
export default configureStore({
  reducer: {
    user: userSlice,
    // count: counterSlice,
  },
});
