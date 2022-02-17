import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
    auth,
    registerWithEmailAndPassword,
    loginWithGoogle,
} from "../firebase";
import NavBar from "../components/Navbar";
import BootstrapPopover from "../components/BootstrapPopover";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/Register.css";

function Register() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("#BFBFBF");
    const [disabled, setDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

    // const history = useHistory();
    const navigate = useNavigate();

    const activateRegistration = () => {
        setBackgroundColor("#E58004");
        setDisabled(false);
    }

    const deactivateRegistration = () => {
        setBackgroundColor("#BFBFBF");
        setDisabled(true);
    }

    const registerConventionally = async () => {
        await registerWithEmailAndPassword(firstName, lastName, email, password).then(() => {
            navigate("/dashboard");
        });
    };

    const registerWithGoogle = async () => {
        await loginWithGoogle(firstName, lastName, email, password).then(() => {
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
            if (firstName && lastName && email.match(/[^@]+@[^@]+\./) && password.length > 5) {
                if (disabled) {
                    activateRegistration();
                }
            } else {
                if (!disabled) {
                    deactivateRegistration();
                }
            }
        }
    }, [loading, user, firstName, lastName, email, password, disabled]);

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
                        <input
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
                            disabled={disabled}
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
                        </div>
                    </div>
                </div>
            </Fragment>
    );
}

export default Register;