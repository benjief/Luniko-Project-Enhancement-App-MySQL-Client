import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, loginWithEmailAndPassword, loginWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import NavBar from "../components/Navbar";
import UserLoginCard from "../components/UserLoginCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/Login.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function Login() {
    const [loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const [email, setEmail] = useState("");
    const [emailAuthenticationError, setEmailAuthenticationError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAuthenticationError, setPasswordAuthenticationError] = useState("");
    const [loginButtonDisabled, setLoginButtonDisabled] = useState(true);
    const [loginWithGoogleButtonDisabled, setLoginWithGoogleButtonDisabled] = useState(false);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
    const alertType = useRef("error-alert");
    const alertMessage = useRef("Apologies! We've encountered an error. Please attempt to log in again.");
    const [displayLoginButtonWorkingIcon, setDisplayLoginButtonWorkingIcon] = useState(false);
    const [displayGoogleButtonWorkingIcon, setDisplayGoogleButtonWorkingIcon] = useState(false);
    const activeError = useRef(false);
    const async = useRef(false);

    const navigate = useNavigate();

    const handleEmailCallback = (emailFromTextInput) => {
        setEmail(emailFromTextInput);
        setEmailAuthenticationError("");
        setPasswordAuthenticationError("");
    }

    const handlePasswordCallback = (passwordFromTextInput) => {
        setPassword(passwordFromTextInput);
        setPasswordAuthenticationError("");
    }

    const attemptConventionalLogin = async (conventionalLoginSelected) => {
        if (conventionalLoginSelected) {
            console.log("attempting to log in conventionally");
            try {
                async.current = true;
                setLoginButtonDisabled(true);
                setLoginWithGoogleButtonDisabled(true);
                setDisplayLoginButtonWorkingIcon(true);
                await loginWithEmailAndPassword(email, password)
                    .then(() => {
                        async.current = false;
                        navigate(`/dashboard/"personnelOkay"`);
                    });
            } catch (err) {
                setLoginButtonDisabled(false);
                setLoginWithGoogleButtonDisabled(false);
                setDisplayLoginButtonWorkingIcon(false);
                if (err.message.indexOf("email") !== -1 || err.message.indexOf("user") !== -1) {
                    async.current = false;
                    setEmailAuthenticationError("User not found");
                } else if (err.message.indexOf("password") !== -1) {
                    async.current = false;
                    setPasswordAuthenticationError("Incorrect password");
                } else {
                    console.log("error caught:", err);
                    handleError();
                }
            }
        }
    }

    const attemptLoginWithGoogle = async (googleLoginSelected) => {
        console.log("attempting to log in with google");
        try {
            async.current = true;
            setLoginButtonDisabled(true);
            setLoginWithGoogleButtonDisabled(true);
            setDisplayGoogleButtonWorkingIcon(true);
            await loginWithGoogle(email, password)
                .then(() => {
                    async.current = false;
                    navigate(`/dashboard/"personnelOkay"`);
                });
        } catch (err) {
            setLoginButtonDisabled(false);
            setLoginWithGoogleButtonDisabled(false);
            setDisplayGoogleButtonWorkingIcon(false);
            console.log("error caught:", err);
            handleError();
        }
    };

    const handleError = () => {
        activeError.current = true;

        // Delay is set up just in case an error is generated before the is fully-displayed
        let delay = transitionElementOpacity === "100%" ? 500 : rendering ? 500 : 0;

        if (rendering) {
            setRendering(false);
        }

        setTimeout(() => {
            setAlert(true);
        }, delay);
    }

    const handleAlertClosed = (alertClosed) => {
        if (alertClosed) {
            setAlert(false);
            navigate(0); // refreshes the page
        }
    }

    useEffect(() => {
        if (loading) {
            return;
        } else {
            setRendering(false);
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!async.current && email !== "" && password !== "") {
                setLoginButtonDisabled(false);
            } else {
                setLoginButtonDisabled(true);
            }
        }
    }, [loading, email, password]);

    return (
        rendering
            ? <div className="loading-spinner">
                <Hypnosis
                    className="spinner"
                    color="var(--lunikoOrange)"
                    width="100px"
                    height="100px"
                    duration="1.5s" />
            </div>
            : activeError.current
                ? <Fragment>
                    <NavBar>
                    </NavBar>
                    {alert
                        ? <div className="alert-container">
                            <PositionedSnackbar
                                message={alertMessage.current}
                                closed={handleAlertClosed}
                                className={alertType.current}>
                            </PositionedSnackbar>
                        </div>
                        : <div></div>}
                    <div
                        className="error-div"
                        style={{ height: "100vw", width: "100%" }}
                    ></div>
                </Fragment>
                : <Fragment>
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
                    {alert
                        ? <div className="alert-container">
                            <PositionedSnackbar
                                message={alertMessage.current}
                                closed={handleAlertClosed}
                                className={alertType.current}>
                            </PositionedSnackbar>
                        </div>
                        : <div></div>}
                    <div className="login">
                        <div className="login-container">
                            <div className="page-heading">
                                Please Log In Below:
                            </div>
                            <div className="login-card">
                                <UserLoginCard
                                    updatedEmail={handleEmailCallback}
                                    updatedPassword={handlePasswordCallback}
                                    emailAuthenticationError={emailAuthenticationError}
                                    passwordAuthenticationError={passwordAuthenticationError}
                                    conventionalLoginSelected={attemptConventionalLogin}
                                    googleLoginSelected={attemptLoginWithGoogle}
                                    loginButtonDisabled={loginButtonDisabled}
                                    loginWithGoogleButtonDisabled={loginWithGoogleButtonDisabled}
                                    displayLoginFadingBalls={displayLoginButtonWorkingIcon}
                                    displayGoogleFadingBalls={displayGoogleButtonWorkingIcon}>
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
                </Fragment >
    );
}

export default Login;
