import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
    auth,
    registerWithEmailAndPassword,
    loginWithGoogle,
} from "../firebase";
import NavBar from "../components/Navbar";
import UserRegistrationCard from "../components/UserRegistrationCard";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
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
    const [password, setPassword] = useState("");
    // const [backgroundColor, setBackgroundColor] = useState("#BFBFBF");
    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

    // const history = useHistory();
    const navigate = useNavigate();

    // const activateRegistration = () => {
    //     setBackgroundColor("#E58004");
    //     setRegisterButtonDisabled(false);
    // }

    // const deactivateRegistration = () => {
    //     setBackgroundColor("#BFBFBF");
    //     setRegisterButtonDisabled(true);
    // }

    const handleFirstNameCallback = (firstNameFromTextInput) => {
        setFirstName(firstNameFromTextInput);
    }

    const handleLastNameCallback = (lastNameFromTextInput) => {
        setLastName(lastNameFromTextInput);
    }

    const handleEmailCallback = (emailFromTextInput) => {
        setEmail(emailFromTextInput);
    }

    const handlePasswordCallback = (passwordFromTextInput) => {
        setPassword(passwordFromTextInput);
    }

    const registerConventionally = async (conventionalRegistrationSelected) => {
        if (conventionalRegistrationSelected) {
            await registerWithEmailAndPassword(firstName, lastName, email, password).then(() => {
                navigate("/dashboard");
            });
        }
    };

    const registerWithGoogle = async (googleRegistrationSelected) => {
        if (googleRegistrationSelected) {
            await loginWithGoogle(email, password).then(() => {
                navigate("/dashboard");
            });
        }
    };

    useEffect(() => {
        if (loading) {
            return;
        } else {
            setRendering(false);
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (firstName !== "" && lastName !== "" && email !== "" && password !== "") {
                // if (registerButtonDisabled) {
                //     activateRegistration();
                // }
                setRegisterButtonDisabled(false);
            } else {
                setRegisterButtonDisabled(true);
            }
        }
    }, [loading, user, firstName, lastName, email, password, registerButtonDisabled]);

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
                                updatedPassword={handlePasswordCallback}
                                registerConventionally={registerConventionally}
                                registerWithGoogle={registerWithGoogle}
                                registerButtonDisabled={registerButtonDisabled}>
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