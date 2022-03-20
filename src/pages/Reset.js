import React, { Fragment, useEffect, useState } from "react";
import Axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";
import NavBar from "../components/Navbar";
import UserResetPasswordCard from "../components/UserResetPasswordCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/Reset.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";
import "../styles/AlertComponents.css";

function Reset() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const [email, setEmail] = useState("");
    const [emailAuthenticationError, setEmailAuthenticationError] = useState("");
    const [registeredEmails, setRegisteredEmails] = useState([]);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
    const navigate = useNavigate();

    const getRegisteredEmails = () => {
        Axios.get("https://luniko-pe.herokuapp.com/get-all-emails", {
        }).then((response) => {
            populateRegisteredEmails(response.data);
        });
    }

    const populateRegisteredEmails = (registeredEmailsList) => {
        if (registeredEmailsList.length) {
            let tempArray = [];
            for (let i = 0; i < registeredEmailsList.length; i++) {
                tempArray.push(registeredEmailsList[i].pers_email);
            }
            setRegisteredEmails([...tempArray]);
        }
        setRendering(false);
    }

    const checkEmail = (inputEmail) => {
        return (registeredEmails.includes(inputEmail));
    }

    const handleEmailCallback = (emailFromTextInput) => {
        setEmail(emailFromTextInput);
        setEmailAuthenticationError("");
    }

    const handleOnClickSubmit = (resetRequested) => {
        if (resetRequested) {
            if (checkEmail(email)) {
                sendPasswordReset(email);
                setAlert(true);
                setTimeout(() => {
                    handleAlertClosed(alert);
                }, 5000);
            } else {
                setEmailAuthenticationError("Email not found");
            }
        }
    }

    const handleAlertClosed = (alertClosed) => {
        if (alertClosed) {
            setAlert(false);
            navigate("/");
        }
    }

    useEffect(() => {
        if (loading) {
            return;
        } else {
            getRegisteredEmails();
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (email.trim() !== "") {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
        // if (user) navigate("/dashboard");
    }, [loading, email]);

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
                <NavBar
                    visibility={"hidden"}
                    srDisabled={true}
                    orDisabled={true}>
                </NavBar>
                {alert
                    ? <div className="alert-container">
                        <PositionedSnackbar
                            message="Password reset email successfully sent!"
                            closed={handleAlertClosed}>
                        </PositionedSnackbar>
                    </div>
                    : <div></div>}
                <div
                    className="transition-element"
                    style={{
                        opacity: transitionElementOpacity,
                        visibility: transtitionElementVisibility
                    }}>
                </div>
                <div className="reset">
                    <div className="reset-container">
                        <div className="page-heading">
                            Reset Your Password Below:
                        </div>
                        <div className="reset-card">
                            <UserResetPasswordCard
                                updatedEmail={handleEmailCallback}
                                emailAuthenticationError={emailAuthenticationError}
                                submitButtonDisabled={submitButtonDisabled}
                                requestReset={handleOnClickSubmit}>
                            </UserResetPasswordCard>
                        </div>
                        {/* <input
                            type="text"
                            className="reset__textBox"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail Address"
                        />
                        <button
                            className="reset__btn"
                            onClick={() => sendPasswordReset(email)}
                        >
                            Send password reset email
                        </button>
                        <div>
                            Don't have an account? <Link to="/register">Register</Link> now.
                        </div> */}
                    </div>
                </div>
            </Fragment>
    );
}

export default Reset;