import {Link} from "react-router-dom";
import '../styles/forgotpassword.css'
function ForgotPassword(){
    return(
        <div className="login-container">
            <div className="login-logo">
                <img src="/src/assets/logo.png"className="logo" alt="Logo"/>
            </div>
            <div className="login-photo">
                <img src="/src/assets/login1.png"className="loginphoto" alt="Login"/>
            </div>
            <h1>Forgot Password</h1>
            <h2>Please enter your details </h2>
            <div className="input-email">
                <input type="text" required />
                <label>E-mail</label>
            </div>
            <div className="input-password">
                <input type="password" required />
                <label>Password</label>
            </div>
            <div className="input-confirmpassword">
                <input type="password" required />
                <label>Confrim Password</label>
            </div>  
            <div className="Signin">
                <Link to='/home'>
                    <button type="button">Sign In</button>
                </Link>     
            </div>    
            <h3 className="back"><a href='/'>Go Back</a></h3>
        </div>
    )
}  
export default ForgotPassword;