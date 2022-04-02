import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import Axios from "axios";
import AddOwnedRequestsCard from "../components/AddOwnedRequestsCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
// import { map } from "@firebase/util";
import { getStatus, getScopeType, getDepartment, getValue, getApprovalStatus } from "../components/DecoderFunctions";
import "../styles/AddOwnedRequests.css";
import "../styles/CardComponents.css";

function AddOwnedRequests() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const { uid, isIdentifier, isOwner } = useParams();
    const [unownedRequests, setUnownedRequests] = useState([]);
    const [addedRequestID, setAddedRequestID] = useState("");
    // const [requestOwners, setRequestOwners] = useState(new Map());
    const [messageContent, setMessageContent] = useState("No requests available!");
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    // const [pageTransitionTime, setPageTransitionTime] = useState("0s");
    const [cardContainerOpacity, setCardContainerOpacity] = useState("100%");
    const [pageMessageopacity, setPageMessageOpacity] = useState("100%");
    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState("success-alert");
    const [alertMessage, setAlertMessage] = useState(["Request ", <strong>{addedRequestID}</strong>, " has been added to your owned requests!"]);
    const [displaySubmitButtonWorkingIcon, setDisplaySubmitButtonWorkingIcon] = useState(false);
    const [addRequestButtonDisabled, setAddRequestButtonDisabled] = useState(false);

    const navigate = useNavigate();

    const getUnownedRequests = () => {
        Axios.get(`https://luniko-pe.herokuapp.com/get-unowned-requests-for-id/${uid}`, {
        }).then((response) => {
            setUnownedRequests(response.data);
            if (response.data.length !== 0) {
                setMessageContent("Available Requests:");
                getRequestOwners(response.data);
            } else {
                setRendering(false);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            }
        });
    };

    const getRequestOwners = async (unownedRequestList) => {
        // let tempMap = new Map();
        for (let i = 0; i < unownedRequestList.length; i++) {
            await Axios.get(`https://luniko-pe.herokuapp.com/get-request-owners-for-id/${unownedRequestList[i].req_id}`, {
            }).then((response) => {
                let owners = [];
                // let req_id = unownedRequestList[i].req_id;
                for (let i = 0; i < response.data.length; i++) {
                    owners.push(response.data[i].req_owner);
                }
                unownedRequestList[i].req_owners = owners;
                // tempMap.set(req_id, owners);

                // setRequestOwners(tempMap);
                // setRendering(false);
            });
        }
        setUnownedRequests(unownedRequestList);
        getSubmittedIdentifiers(unownedRequestList);
    };

    const getSubmittedIdentifiers = async (unownedRequestList) => {
        for (let i = 0; i < unownedRequestList.length; i++) {
            await Axios.get(`https://luniko-pe.herokuapp.com/get-identifier-names-for-submitted-request/${unownedRequestList[i].req_id}`, {
            }).then((response) => {
                let submittedIdentifiers = []
                for (let i = 0; i < response.data.length; i++) {
                    submittedIdentifiers.push(response.data[i].pers_name);
                    // console.log("added identifier " + i);
                }
                unownedRequestList[i].req_identifiers = submittedIdentifiers;
            });
        }
        setUnownedRequests([...unownedRequestList]);
        setRendering(false);
    };

    // const getOwnerList = (id) => {
    //     let ownerList = "";
    //     let returnedOwners = requestOwners.get(id);
    //     if (returnedOwners) {
    //         for (let i = 0; i < returnedOwners.length; i++) {
    //             ownerList += returnedOwners[i];
    //             ownerList += i !== returnedOwners.length - 1 ? "<br />" : "";
    //         }
    //     }
    //     return ownerList;
    // }

    const handleAddRequestCallback = (requestFromCard) => {
        setAddRequestButtonDisabled(true)
        setDisplaySubmitButtonWorkingIcon(true);
        if (unownedRequests.length > 1) {
            setAddedRequestID(requestFromCard);
            setAlert(true);
        }
        Axios.post("https://luniko-pe.herokuapp.com/create-ownership", {
            uid: uid,
            req_id: requestFromCard
        }).catch((err) => {
            handleError();
        }).then((response) => {
            if (response) {
                console.log("Ownership successfully added!");
                setUnownedRequests(unownedRequests.filter((val) => {
                    return val.req_id !== requestFromCard;
                }));
            }
            if (unownedRequests.length === 1) {
                setPageMessageOpacity("0%");
                setTimeout(() => {
                    setMessageContent("No more requests available!");
                    setPageMessageOpacity("100%");
                }, 300);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            }
        });
    };

    const handleError = () => {
        setAlertType("error-alert");
        setAlertMessage("Aplogies! We've encountered an error. Please attempt to re-submit your checklist.");
        setAlert(true);
    }

    const handleAlertClosed = (alertClosed) => {
        if (alertClosed) {
            setAlert(false);
        }
    }

    useEffect(() => {
        if (loading) {
            return;
        } if (!user || !uid) {
            return navigate("/");
        } if (rendering) {
            getUnownedRequests();
        } else {
            // console.log(unownedRequests);
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
        }
    }, [loading, user, rendering, uid]);

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
                    createRequestLink={`/create-request/${uid}/${isIdentifier}/${isOwner}`}
                    submittedRequestsLink={`/submitted-requests/${uid}/${isIdentifier}/${isOwner}`}
                    ownedRequestsLink={`/owned-requests/${user?.uid}/${isIdentifier}/${isOwner}`}>
                </NavBar>
                {alert
                    ? <div className="alert-container">
                        <PositionedSnackbar
                            message={alertMessage}
                            closed={handleAlertClosed}
                            className={alertType}>
                        </PositionedSnackbar>
                    </div>
                    : <div></div>
                }
                <div className="unowned-requests">
                    <p
                        className="page-message"
                        style={{ opacity: pageMessageopacity }}>
                        {messageContent}</p>
                    <div
                        className="unowned-requests-container">
                        {/* style={{ opacity: cardContainerOpacity }}> */}
                        {unownedRequests.map((val, key) => {
                            return <div
                                className="unowned-request-card"
                                key={key}
                                /*style={{ opacity: cardContainerOpacity }}*/>
                                <AddOwnedRequestsCard
                                    requestsRemaining={unownedRequests.length - 1}
                                    id={val.req_id}
                                    dateSubmitted={val.req_date}
                                    lastUpdated={val.req_updated}
                                    status={val.req_rejected.data[0] === 1 ? "Rejected" : getStatus(val.req_status)}
                                    approved={getApprovalStatus(val.req_approved.data[0])}
                                    submitter={val.req_submitter}
                                    identifiers={val.req_identifiers}
                                    owners={val.req_owners}
                                    scopeType={getScopeType(val.req_scope_type)}
                                    department={getDepartment(val.req_dept)}
                                    description={val.req_descr}
                                    value={getValue(val.req_value)}
                                    comments={val.req_comments === "" || val.req_comments === null ? "None" : val.req_comments}
                                    toAdd={handleAddRequestCallback}
                                    displayFadingBalls={displaySubmitButtonWorkingIcon}
                                    addRequestButtonDisabled={addRequestButtonDisabled}>
                                </AddOwnedRequestsCard>
                            </div>
                        })}
                    </div>
                </div>
            </Fragment >
    );
}

export default AddOwnedRequests;