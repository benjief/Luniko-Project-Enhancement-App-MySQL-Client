import React, { Fragment, useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
    auth,
    registerWithEmailAndPassword,
    loginWithGoogle,
} from "../firebase";
import NavBar from "../components/Navbar";
import UserRegistrationCard from "../components/UserRegistrationCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import Axios from "axios";
import "../styles/Register.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function Register() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [emailAuthenticationError, setEmailAuthenticationError] = useState("");
    const [registeredEmails, setRegisteredEmails] = useState("");
    const [password, setPassword] = useState("");
    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);
    const [registerWithGoogleButtonDisabled, setRegisterWithGoogleButtonDisabled] = useState(false);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
    const alertType = useRef("success-alert");
    const alertMessage = useRef("Registration successful!");
    const loadErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to re-load this page.");
    const registrationErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to register again.");
    const [displayRegisterButtonWorkingIcon, setDisplayRegisterButtonWorkingIcon] = useState(false);
    const [displayGoogleButtonWorkingIcon, setDisplayGoogleButtonWorkingIcon] = useState(false);
    const activeError = useRef(false);
    const async = useRef(false);

    const navigate = useNavigate();

    const runAsyncReadFunctions = async () => {
        await getRegisteredEmails();
        setRendering(false);
    }

    const getRegisteredEmails = async () => {
        console.log("fetching registered emails");
        try {
            async.current = true;
            Axios.get("https://luniko-pe.herokuapp.com/get-all-personnel", {
            }).then(response => {
                populateRegisteredEmailList(response.data);
            });
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    };

    const populateRegisteredEmailList = (personnelList) => {
        console.log("populating registered emails list");
        try {
            let tempArray = [];
            for (let i = 0; i < personnelList.length; i++) {
                tempArray.push(personnelList[i].pers_email);
            }
            setRegisteredEmails([...tempArray]);
            async.current = false;
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    const handleFirstNameCallback = (firstNameFromTextInput) => {
        setFirstName(firstNameFromTextInput);
    }

    const handleLastNameCallback = (lastNameFromTextInput) => {
        setLastName(lastNameFromTextInput);
    }

    const handleEmailCallback = (emailFromTextInput) => {
        setEmail(emailFromTextInput);
        setEmailAuthenticationError("");
        checkIfEmailAlreadyRegistered(emailFromTextInput);
    }

    const checkIfEmailAlreadyRegistered = (email) => {
        if (registeredEmails.includes(email)) {
            setEmailAuthenticationError("Email already in use");
        }
    }

    const handlePasswordCallback = (passwordFromTextInput) => {
        setPassword(passwordFromTextInput);
    }

    const attemptConventionalRegistration = async (conventionalRegistrationSelected) => {
        if (conventionalRegistrationSelected) {
            try {
                setDisplayRegisterButtonWorkingIcon(true);
                async.current = true;
                setRegisterButtonDisabled(true);
                setRegisterWithGoogleButtonDisabled(true);
                await registerWithEmailAndPassword(firstName, lastName, email, password)
                    .then(() => {
                        async.current = false;
                        setAlert(true);
                        setTimeout(() => {
                            navigate(`/dashboard/"noPersonnelError"`);
                        }, 3000);
                    });
            } catch (err) {
                console.log("error caught");
                if (err.message.indexOf("personnelError") !== -1) {
                    async.current = false;
                    navigate(`/dashboard/${err.message}`);
                } else if (err.message.indexOf("email") !== -1 || err.message.indexOf("user") !== -1) {
                    setEmailAuthenticationError("Email already in use");
                } else {
                    console.log("error caught:", err);
                    handleError("o");
                }
            }
        }
    }

    const attemptGoogleRegistration = async (googleRegistrationSelected) => {
        if (googleRegistrationSelected) {
            try {
                setDisplayGoogleButtonWorkingIcon(true);
                async.current = true;
                setRegisterButtonDisabled(true);
                setRegisterWithGoogleButtonDisabled(true);
                await loginWithGoogle(email, password)
                    .then(() => {
                        async.current = false;
                        setAlert(true);
                        setTimeout(() => {
                            navigate(`/dashboard/"personnelOkay"`);
                        }, 3000);
                    });
            } catch (err) {
                if (err.message.indexOf("personnelOkay") !== -1) {
                    async.current = false;
                    navigate(`/dashboard/${err.message}`);
                } else {
                    console.log("error caught:", err);
                    handleError("o");
                }
            }
        }
    }

    const handleError = (errorType) => {
        activeError.current = true;
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage.current
            : alertMessage.current = registrationErrorMessage.current;

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
            // Refreshes the page
            if (activeError.current) {
                navigate(0);
            }
        }
    }

    useEffect(() => {
        if (loading) {
            return;
        }
        if (rendering) {
            runAsyncReadFunctions();
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!async.current && firstName !== "" && lastName !== "" && email !== "" && password !== "" && emailAuthenticationError === "") {
                // if (registerButtonDisabled) {
                //     activateRegistration();
                // }
                setRegisterButtonDisabled(false);
            } else {
                setRegisterButtonDisabled(true);
            }
        }
    }, [loading, user, firstName, lastName, email, password, registerButtonDisabled, emailAuthenticationError, rendering, async]);

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
                                className="success-alert"
                            >
                            </PositionedSnackbar>
                        </div>
                        : <div></div>}
                    <div className="register">
                        <div className="register-container">
                            <div className="page-heading">
                                Please Register Below:
                            </div>
                            <div className="register-card">
                                <UserRegistrationCard
                                    updatedFirstName={handleFirstNameCallback}
                                    updatedLastName={handleLastNameCallback}
                                    updatedEmail={handleEmailCallback}
                                    emailAuthenticationError={emailAuthenticationError}
                                    updatedPassword={handlePasswordCallback}
                                    registerConventionally={attemptConventionalRegistration}
                                    registerWithGoogle={attemptGoogleRegistration}
                                    registerButtonDisabled={registerButtonDisabled}
                                    registerWithGoogleButtonDisabled={registerWithGoogleButtonDisabled}
                                    displayRegisterFadingBalls={displayRegisterButtonWorkingIcon}
                                    displayGoogleFadingBalls={displayGoogleButtonWorkingIcon}
                                >
                                </UserRegistrationCard>
                            </div>
                            {/* <input
                            type="text"
                            className="register-textBox"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            placeholder="First Name"
                            required={true}
                        />
                        <input
                            type="text"
                            className="register-textBox"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            placeholder="Last Name"
                            required={true}
                            pattern="/[^@]+@[^@]+\./"
                        />
                        <input
                            type="text"
                            className="register-textBox"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="E-mail Address"
                            required={true}
                            minLength={6}
                        />
                        <input
                            type="password"
                            className="register-textBox"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password"
                            required={true}
                        />
                        <button className="register-button"
                            style={{ backgroundColor: backgroundColor }}
                            disabled={registerButtonDisabled}
                            onClick={registerConventionally}>
                            Register
                        </button>
                        <div
                            className="register-google"
                            onClick={registerWithGoogle}>
                            <img src={require("../img/google_logo.png")} alt="Google" />
                            <p>Register with Google</p>
                        </div>
                        <BootstrapPopover
                            popoverText=
                            {["A ", <strong>valid email address </strong>, "and password length of ", <strong>at least six characters </strong>,
                                "are required for registration."]}>
                        </BootstrapPopover>
                        <div className="register-text-container">
                            <div>
                                Already have an account? <Link to="/">Login</Link> now.
                            </div>
                        </div> */}
                        </div>
                    </div>
                </Fragment>
    );
}

export default Register;