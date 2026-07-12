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
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#0b0f19", // Deep dark background
      fontFamily: ThemeConfig.fonts.main,
      padding: "1rem"
    }}>
      {/* Centered Login/Signup Card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#111827", // Odoo dark card background
        border: "1px solid #1f2937",
        borderRadius: "16px",
        padding: "2.5rem 2rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        
        {/* Header Title */}
        <h2 style={{
          margin: "0 0 1.5rem 0",
          fontSize: "1.6rem",
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center"
        }}>
          AssetFlow – {isSignup ? "signup" : "login"}
        </h2>

        {/* Circular AF Logo */}
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          border: "2px solid #374151",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: ThemeConfig.colors.secondary, // Emerald green tone
          marginBottom: "2rem",
          backgroundColor: "#1f2937"
        }}>
          AF
        </div>

        {/* Form Container */}
        <form 
          onSubmit={isSignup ? handleSignup : handleLogin} 
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            width: "100%"
          }}
        >
          {isSignup && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", color: "#9ca3af", fontWeight: "500" }}>Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  outline: "none"
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", color: "#9ca3af", fontWeight: "500" }}>Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                color: "#fff",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", position: "relative" }}>
            <label style={{ fontSize: "0.85rem", color: "#9ca3af", fontWeight: "500" }}>Password</label>
            <input
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                color: "#fff",
                outline: "none"
              }}
            />
            {!isSignup && (
              <span style={{
                alignSelf: "flex-end",
                fontSize: "0.8rem",
                color: "#9ca3af",
                cursor: "pointer",
                marginTop: "4px"
              }}>
                Forgot password
              </span>
            )}
          </div>

          <Button 
            type="submit" 
            variant="secondary"
            style={{
              padding: "12px",
              fontWeight: "600",
              marginTop: "0.5rem"
            }}
          >
            {loading ? (isSignup ? "Creating Account..." : "Signing In...") : (isSignup ? "Register Account" : "Sign In")}
          </Button>
        </form>

        {/* Divider Line */}
        <hr style={{
          width: "100%",
          border: "0",
          borderTop: "1px solid #1f2937",
          margin: "2rem 0 1.5rem 0"
        }} />

        {/* Toggle Footer Segment */}
        {!isSignup ? (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ color: "#9ca3af", fontSize: "0.9rem", display: "block", marginBottom: "0.75rem" }}>New here?</span>
              
              {/* Alert Message Box */}
              <div style={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "0.8rem",
                color: "#cbd5e1",
                lineHeight: "1.4"
              }}>
                Sign up creates an employee account admin roles assigned later
              </div>
            </div>

            <Button 
              onClick={() => setIsSignup(true)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #4b5563",
                color: "#fff",
                padding: "10px",
                fontWeight: "500"
              }}
            >
              Create Account
            </Button>
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Already have an account?</span>
            <Button 
              onClick={() => setIsSignup(false)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #4b5563",
                color: "#fff",
                padding: "10px",
                fontWeight: "500"
              }}
            >
              Sign In
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;