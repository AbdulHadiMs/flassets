import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";

import {
  AuthProvider,
} from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <AuthProvider>

    <Toaster
      position="top-right"
      reverseOrder={false}
    />

    <App />

  </AuthProvider>
);