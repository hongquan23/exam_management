import React, { useState } from "react";
import AuthForm from "./auth/Login";
import ToeicAdmin from "./admin/ToeicAdmin";

// 🔹 Import trang Member
import { ToeicMember } from "./member";

function App() {
  const [role, setRole] = useState(null);

  const handleLogin = (selectedRole) => {
    if (selectedRole === "ADMIN") {
      setRole("ADMIN");
    } else {
      setRole("MEMBER");
    }
  };

  if (role === "ADMIN") {
    return <ToeicAdmin />;
  }

  if (role === "MEMBER") {
    return <ToeicMember />;
  }

  return <AuthForm onLogin={handleLogin} />;
}

export default App;
