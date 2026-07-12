import React, { useState } from "react";
import { Button } from "../../components/Button";
import api from "../../api";

const Login = () => {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post("/yash/auth/login", {

                email,

                password

            });

            localStorage.setItem("token", response.data.token);

            localStorage.setItem(

                "user",

                JSON.stringify(response.data.user)

            );

            alert("Login Successful!");

            window.location.reload();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Login Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div
            style={{
                padding: "2rem",
                maxWidth: "450px",
                margin: "0 auto"
            }}
        >

            <h2
                style={{
                    marginBottom: "1.5rem"
                }}
            >
                Login
            </h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                }}
            >

                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    required

                    style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}

                />

                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                    required

                    style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}

                />

                <Button

                    type="submit"

                >

                    {

                        loading ?

                        "Signing In..."

                        :

                        "Sign In"

                    }

                </Button>

            </form>

        </div>

    );

};

export default Login;