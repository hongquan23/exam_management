import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder, show, toggleShow }) => (
  <div className={styles.passwordContainer}>
    <input
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
    <span className={styles.togglePassword} onClick={toggleShow}>
      {show ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
);

const AuthForm = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("MEMBER");

  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("loginContainer");

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener("click", () => {
        container.classList.add(styles.rightPanelActive);
      });
      signInButton.addEventListener("click", () => {
        container.classList.remove(styles.rightPanelActive);
      });
    }
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }
    alert("Đăng ký thành công (frontend mock)!");
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (onLogin) onLogin(role);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }
    alert("Khôi phục mật khẩu thành công (frontend mock)!");
    setForgotMode(false);
    setResetEmail("");
    setNewPassword("");
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer} id="loginContainer">
        
        {/* Sign Up */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 chars)"
              show={showPasswordSignUp}
              toggleShow={() => setShowPasswordSignUp(!showPasswordSignUp)}
            />

            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          {!forgotMode ? (
            <form onSubmit={handleSignIn}>
              <h1>Sign in</h1>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                show={showPasswordSignIn}
                toggleShow={() => setShowPasswordSignIn(!showPasswordSignIn)}
              />

              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <button type="submit">Sign In</button>

              <p style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Forgot Password?
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <h1>Reset Password</h1>
              <p>Nhập email và mật khẩu mới</p>

              <input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />

              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (min 8 chars)"
                show={showNewPassword}
                toggleShow={() => setShowNewPassword(!showNewPassword)}
              />

              <button type="submit">Update Password</button>

              <p style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Back to Sign In
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Overlay */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>Welcome Back!</h1>
              <p>Please login with your personal info</p>
              <button className="ghost" id="signIn">Sign In</button>
            </div>

            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>Hello, Friend!</h1>
              <p>Enter your details and start your journey with us</p>
              <button className="ghost" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthForm;
