import React, { useState } from "react";
import { Button } from "../../components/Button";
import { ThemeConfig } from "../../components/ThemeConfig";
import api from "../../api";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/yash/auth/login", { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      alert("Login Successful!");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/yash/auth/signup", { 
        name, 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert("Registration Successful! Welcome to AssetFlow.");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#05070a", // Ultra deep background
      backgroundImage: "radial-gradient(circle at 15% 50%, rgba(16, 185, 129, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(79, 70, 229, 0.1), transparent 25%)",
      fontFamily: ThemeConfig.fonts.main,
      color: "#fff"
    }}>
      
      {/* Left Branding Panel */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "4rem",
        background: "linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(11, 15, 25, 0.95) 100%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "2rem",
            boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
          }}>
            AF
          </div>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "1rem", lineHeight: "1.1", background: "linear-gradient(to right, #fff, #9ca3af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Enterprise<br/>Asset Mastery.
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", maxWidth: "450px", lineHeight: "1.6" }}>
            Streamline your organizational resources with intelligent tracking, intuitive auditing, and seamless allocations.
          </p>
        </div>
        {/* Abstract Background Shapes */}
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Right Auth Panel */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(17, 24, 39, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "3rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}>
          
          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: "2.5rem", background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "6px" }}>
            <button 
              onClick={() => setIsSignup(false)}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: !isSignup ? "rgba(255,255,255,0.1)" : "transparent",
                color: !isSignup ? "#fff" : "#9ca3af",
                fontWeight: !isSignup ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsSignup(true)}
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: isSignup ? "rgba(255,255,255,0.1)" : "transparent",
                color: isSignup ? "#fff" : "#9ca3af",
                fontWeight: isSignup ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Register
            </button>
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            {isSignup ? "Create an Account" : "Welcome Back"}
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "2rem" }}>
            {isSignup ? "Join your organization's AssetFlow workspace." : "Enter your credentials to access your workspace."}
          </p>

          <form onSubmit={isSignup ? handleSignup : handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {isSignup && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#d1d5db", fontWeight: "500", marginBottom: "0.5rem" }}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = ThemeConfig.colors.secondary}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#d1d5db", fontWeight: "500", marginBottom: "0.5rem" }}>Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "#fff",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = ThemeConfig.colors.secondary}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#d1d5db", fontWeight: "500" }}>Password</label>
                {!isSignup && (
                  <span style={{ fontSize: "0.8rem", color: ThemeConfig.colors.secondary, cursor: "pointer", fontWeight: "500" }}>Forgot password?</span>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "#fff",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = ThemeConfig.colors.secondary}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <button 
              type="submit" 
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                fontSize: "1rem",
                marginTop: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
                transition: "transform 0.1s, boxShadow 0.1s"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-1px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              {loading ? "Please wait..." : (isSignup ? "Create Account" : "Sign In")}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Login;