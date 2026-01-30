import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import ToeicAdmin from "./admin/ToeicAdmin";
import ToeicMember  from "./member/ToeicMember";

  ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Member */}
        <Route path="/member/*" element={<ToeicMember />} />

        {/* Admin */}
        <Route path="/admin/*" element={<ToeicAdmin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

