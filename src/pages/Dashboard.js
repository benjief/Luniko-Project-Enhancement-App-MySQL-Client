import React, { Fragment, useEffect, useState } from "react";
import Axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
// import { query, collection, getDocs, where } from "firebase/firestore";
import NavBar from "../components/Navbar";
import DashboardOptionsCard from "../components/DashboardOptionsCard";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/Dashboard.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/CardComponents.css";

function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
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
    const navigate = useNavigate();

    const getPersonnelInfoWithID = (id) => {
        Axios.get(`https://luniko-pe.herokuapp.com/get-personnel-with-id/${id}`, {
        }).then((response) => {
            setFirstName(response.data[0].pers_fname);
            if (response.data[0].pers_is_identifier.data[0] === 1) {
                setIsIdentifier(true);
                setSubmittedRequestsButtonDisabled(false);
            } else {
                setIsIdentifier(false);
                setSubmittedRequestsButtonDisabled(true);
            }
            if (response.data[0].pers_is_owner.data[0] === 1) {
                setIsOwner(true);
                setAddToOwnedRequestsButtonDisabled(false);
                getOwnedRequests(id);
            } else {
                setIsOwner(false);
                setAddToOwnedRequestsButtonDisabled(true);
                setRendering(false);
            }
        });
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

    useEffect(() => {
        if (loading) {
            return;
        } if (!user) {
            return navigate("/");
        } if (rendering) {
            getPersonnelInfoWithID(user?.uid);
        } else {
            // getPersonnelInfoWithID(user?.uid);
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
        }
    }, [loading, user, rendering]);

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
                    visibility={"visible"}
                    srDisabled={!(isIdentifier === "true" || isIdentifier === true)}
                    orDisabled={!(isOwner === "true" || isOwner === true)}
                    createRequestLink={`/create-request/${user?.uid}/${isIdentifier}/${isOwner}`}
                    submittedRequestsLink={`/submitted-requests/${user?.uid}/${isIdentifier}/${isOwner}`}
                    ownedRequestsLink={`/owned-requests/${user?.uid}/${isIdentifier}/${isOwner}`}>
                </NavBar>
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