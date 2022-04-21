import React, { Fragment, useEffect, useState, useRef } from "react";
import Axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams, Link } from "react-router-dom";
import { auth, logout, deleteUser } from "../firebase";
// import { query, collection, getDocs, where } from "firebase/firestore";
import NavBar from "../components/Navbar";
import DashboardOptionsCard from "../components/DashboardOptionsCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/Dashboard.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const { error } = useParams();
    const [firstName, setFirstName] = useState("");
    const [isIdentifier, setIsIdentifier] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [ownsRequests, setOwnsRequests] = useState(false);
    const [submittedRequestsButtonDisabled, setSubmittedRequestsButtonDisabled] = useState(true);
    const [addToOwnedRequestsButtonDisabled, setAddToOwnedRequestsButtonDisabled] = useState(true);
    const [ownedRequestsButtonDisabled, setOwnedRequestsButtonDisabled] = useState(true);
    // const [srBackgroundColor, setSRBackgroundColor] = useState("#BFBFBF");
    // const [aorBackgroundColor, setAORBackgroundColor] = useState("#BFBFBF");
    // const [orBackgroundColor, setORBackgroundColor] = useState("#BFBFBF");
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);
    const alertType = useRef("success-alert");
    const alertMessage = useRef("Registration successful!");
    const loadErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to re-load this page.");
    const registrationErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to register again.");
    const activeError = useRef(false);
    const async = useRef(false);
    const deletingUser = useRef(false);
    const navigate = useNavigate();

    const runAsyncReadFunctions = async (uid) => {
        if (error === "personnelError") {
            await deleteUserFromFirebase(uid);
        } else {
            await getPersonnelInfoWithID(uid);
            setRendering(false);
        }
    }

    const deleteUserFromFirebase = (uid) => {
        console.log("deleting user from firebase");
        try {
            activeError.current = true;
            deletingUser.current = true;
            handleError("o");
            setTimeout(async () => {
                await user.delete()
                    .then(() => {
                        deletingUser.current = false;
                        console.log("deleted user");
                    });
            }, 3000);
        } catch (err) {
            console.log("error caught:", err);
            logout();
        }
    }

    const getPersonnelInfoWithID = async (id) => {
        console.log("fetching personnel info");
        try {
            async.current = true;
            await Axios.get(`https://luniko-pe.herokuapp.com/get-personnel-with-id/${id}`, {
            }).then(response => {
                setFirstName(response.data[0].pers_fname);
                checkPersonnelStatus(response.data[0]);
                async.current = false;
            });
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    const checkPersonnelStatus = async (personnelData) => {
        if (personnelData.pers_is_identifier.data[0] === 1) {
            setIsIdentifier(true);
            setSubmittedRequestsButtonDisabled(false);
        } else {
            setIsIdentifier(false);
            setSubmittedRequestsButtonDisabled(true);
        }
        if (personnelData.pers_is_owner.data[0] === 1) {
            setIsOwner(true);
            setAddToOwnedRequestsButtonDisabled(false);
            await getOwnedRequests(personnelData.pers_id);
        } else {
            setIsOwner(false);
            setAddToOwnedRequestsButtonDisabled(true);
        }
    }

    const getOwnedRequests = (id) => {
        Axios.get(`https://luniko-pe.herokuapp.com/get-owned-requests-for-id/${id}`, {
        }).then((response) => {
            if (response.data[0]) {
                setOwnsRequests(true);
                setOwnedRequestsButtonDisabled(false);
            } else {
                setOwnsRequests(false);
                setOwnedRequestsButtonDisabled(true);
            }
            setRendering(false);
        });
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
            if (!deletingUser.current) {
                logout();
            }
        }
    }

    useEffect(() => {
        if (loading) {
            return;
        } if (!user) {
            return navigate("/");
        } if (rendering) {
            runAsyncReadFunctions(user?.uid);
        } else {
            // getPersonnelInfoWithID(user?.uid);
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
        }
    }, [loading, user, rendering]);

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
                        visibility={"visible"}
                        srDisabled={!(isIdentifier === "true" || isIdentifier === true)}
                        orDisabled={!(isOwner === "true" || isOwner === true)}
                        createRequestLink={`/create-request/${user?.uid}/${isIdentifier}/${isOwner}`}
                        submittedRequestsLink={`/submitted-requests/${user?.uid}/${isIdentifier}/${isOwner}`}
                        ownedRequestsLink={`/owned-requests/${user?.uid}/${isIdentifier}/${isOwner}`}>
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
                    <div className="dashboard">
                        <div className="dashboard-container">
                            <div className="page-heading">
                                Please choose an option below:
                            </div>
                            <div className="dashboard-card">
                                <DashboardOptionsCard
                                    uid={user?.uid}
                                    isIdentifier={isIdentifier}
                                    isOwner={isOwner}
                                    firstName={firstName}
                                    submittedRequestsButtonDisabled={submittedRequestsButtonDisabled}
                                    addToOwnedRequestsButtonDisabled={addToOwnedRequestsButtonDisabled}
                                    ownedRequestsButtonDisabled={ownedRequestsButtonDisabled}
                                >
                                </DashboardOptionsCard>
                            </div>
                            {/* <p>Welcome, <b>{firstName}</b>!</p>
                        <Link to={`/create-request/${user?.uid}/${isIdentifier}/${isOwner}`}>
                            <button
                                className="add-request-button">
                                Create Request
                            </button>
                        </Link>
                        <Link to={`/submitted-requests/${user?.uid}/${isIdentifier}/${isOwner}`}>
                            <button
                                className="submitted-requests-button"
                                disabled={!(isIdentifier === "true" || isIdentifier === true)}
                                style={{ backgroundColor: srBackgroundColor }}>
                                Submitted Requests
                            </button>
                        </Link>
                        <Link to={`/add-owned-requests/${user?.uid}/${isIdentifier}/${isOwner}`}>
                            <button
                                className="add-owned-requests-button"
                                disabled={!(isOwner === "true" || isOwner === true)}
                                style={{ backgroundColor: aorBackgroundColor }}>
                                Add to Owned Requests
                            </button>
                        </Link>
                        <Link to={`/owned-requests/${user?.uid}/${isIdentifier}/${isOwner}`}>
                            <button
                                className="owned-requests-button"
                                disabled={!(ownsRequests === "true" || ownsRequests === true)}
                                style={{ backgroundColor: orBackgroundColor }}>
                                Owned Requests
                            </button>
                        </Link>
                        <button className="logout-button" onClick={logout}>
                            Logout
                        </button> */}
                        </div>
                    </div>
                </Fragment >
    );
}

export default Dashboard;