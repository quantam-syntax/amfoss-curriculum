import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                localStorage.setItem("melofi_user", JSON.stringify(data.user));
                localStorage.setItem("userId", data.user.id);   
                navigate("/home");
            }
        } catch (err) {
            console.error(err);
            setError("Could not reach server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-logo">
                <img src="/src/assets/logo.png" className="logo" alt="Logo" />
            </div>
            <div className="login-photo">
                <img src="/src/assets/login1.png" className="loginphoto" alt="Login" />
            </div>
            <h1>Welcome Back</h1>
            <h2>Please enter your details</h2>

            <form onSubmit={handleSubmit}>
                <div className="input-email">
                    <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>E-mail</label>
                </div>
                <div className="input-password">
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <div className="Signin1">
                    <button type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
            </form>

            <h3 className="dont">Dont have an account?</h3>
            <div className="signup">
                <Link to="/register">
                    <h3>Sign Up</h3>
                </Link>
            </div>
            <div className="forgot">
                <Link to="/forgotpassword">
                    <h3>Forgot Password?</h3>
                </Link>
            </div>
        </div>
    );
}

export default Login;
