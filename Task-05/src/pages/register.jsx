import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";

function Register() {
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
            const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
            } else {
                // after successful signup, go to login
                navigate("/");
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
            <h1>Register</h1>
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

                <div className="Signup">
                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </div>
            </form>

            <h3 className="have">
                Have an account? <Link to="/">Sign In</Link>
            </h3>
        </div>
    );
}

export default Register;
