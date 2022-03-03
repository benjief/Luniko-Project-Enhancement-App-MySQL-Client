import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, loginWithEmailAndPassword, loginWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "../components/Navbar";
import UserLoginCard from "../components/UserLoginCard";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/Login.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function Login() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const [email, setEmail] = useState("");
    const [emailAuthenticationError, setEmailAuthenticationError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAuthenticationError, setPasswordAuthenticationError] = useState("");
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const navigate = useNavigate();

    const handleEmailCallback = (emailFromTextInput) => {
        setEmail(emailFromTextInput);
        setEmailAuthenticationError("");
    }

    const handlePasswordCallback = (passwordFromTextInput) => {
        console.log(passwordFromTextInput);
        setPassword(passwordFromTextInput);
        setPasswordAuthenticationError("");
    }

    const attemptConventionalLogin = async () => {
        try {
            await loginWithEmailAndPassword(email, password).then(() => {
                navigate("/dashboard");
            });
        } catch (err) {
            // console.log("error caught!");
            console.log(err.message);
            if (err.message.indexOf("email") !== -1) {
                setEmailAuthenticationError("User not found");
            } else if (err.message.indexOf("password") !== -1) {
                setPasswordAuthenticationError("Incorrect password");
            }
        }
    }

    const attemptLoginWithGoogle = async () => {
        await loginWithGoogle(email, password).then(() => {
            navigate("/dashboard");
        });
    };

    useEffect(() => {
        if (loading) {
            return;
        } else {
            setRendering(false);
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (email !== "" && password !== "") {
                setLoginButtonDisabled(false);
            } else {
                setLoginButtonDisabled(true);
            }
        }
    }, [loading, email, password]);

    return (
        rendering ?
            <div className="loading-spinner">
                <Hypnosis
                    className="spinner"
                    color="var(--lunikoOrange)"
                    width="100px"
                    height="100px"
                    duration="1.5s" />
            </div> :
            <Fragment>
                <div
                    className="transition-element"
                    style={{
                        opacity: transitionElementOpacity,
                        visibility: transtitionElementVisibility
                    }}>
                </div>
                <NavBar
                    visibility={"hidden"}
                    srDisabled={true}
                    orDisabled={true}>
                </NavBar>
                <div className="login">
                    <div className="login-container">
                        <div className="login-card">
                            <UserLoginCard
                                updatedEmail={handleEmailCallback}
                                updatedPassword={handlePasswordCallback}
                                emailAuthenticationError={emailAuthenticationError}
                                passwordAuthenticationError={passwordAuthenticationError}
                                loginConventionally={attemptConventionalLogin}
                                loginWithGoogle={attemptLoginWithGoogle}
                                loginButtonDisabled={loginButtonDisabled}>
                            </UserLoginCard>
                        </div>
                        {/* <input
                            type="text"
                            className="login-textBox"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="E-mail Address"
                        />
                        <input
                            type="password"
                            className="login-textBox"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password"
                        />
                        <button
                            className="login-button"
                            onClick={() => loginWithEmailAndPassword(email, password)}
                        >
                            Login
                        </button>
                        <div
                            className="login-google"
                            onClick={attemptLoginWithGoogle}>
                            <img src={require("../img/google_logo.png")} alt="Luniko" />
                            <p>Login with Google</p>
                        </div>
                        <div className="login-text-container">
                            <div>
                                <Link to="/reset">Forgot Password</Link>
                            </div>
                            <div>
                                Don't have an account? <Link to="/register">Register</Link> now.
                            </div>
                        </div> */}
                    </div>
                </div>
            </Fragment>
    );
}

export default Login;
