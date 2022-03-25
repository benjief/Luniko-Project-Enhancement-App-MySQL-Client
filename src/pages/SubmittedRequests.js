import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import Axios from "axios";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import SubmittedRequestCard from "../components/SubmittedRequestCard";
import { getStatus, getScopeType, getDepartment, getValue, getApprovalStatus } from "../components/DecoderFunctions";
import "../styles/SubmittedRequests.css";
import "../styles/CardComponents.css";

function SubmittedRequests() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const navigate = useNavigate();
    const { uid, isIdentifier, isOwner } = useParams();
    const [submittedRequests, setSubmittedRequests] = useState([]);
    const [messageContent, setMessageContent] = useState("You haven't yet submitted any requests!");
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

    const getSubmittedRequests = () => {
        Axios.get(`https://luniko-pe.herokuapp.com/get-submitted-requests-for-id/${uid}`, {
        }).then((response) => {
            // response.data[0].req_identifiers = ["Benjie Friedman", "Wanika Lai"];
            // setSubmittedRequests(response.data);
            if (response.data.length !== 0) {
                setMessageContent("Your submitted requests:");
            }
            // setRendering(false);
            getSubmittedIdentifiers(response.data);
        });
    };

    const getSubmittedIdentifiers = async (requestList) => {
        for (let i = 0; i < requestList.length; i++) {
            await Axios.get(`https://luniko-pe.herokuapp.com/get-identifier-names-for-submitted-request/${requestList[i].req_id}`, {
            }).then((response) => {
                let submittedIdentifiers = []
                for (let i = 0; i < response.data.length; i++) {
                    submittedIdentifiers.push(response.data[i].pers_name);
                }
                requestList[i].req_identifiers = submittedIdentifiers;
            });
        }
        setSubmittedRequests([...requestList]);
        setRendering(false);
    };

    // const populateIdentifierList = (submittedIdentifiers) => {
    //     let tempArray = [];
    //     if (submittedIdentifiers.length > 1) {
    //         for (let i = 0; i < submittedIdentifiers.length; i++) {
    //             tempArray.push(submittedIdentifiers[i]);
    //         }
    //     }
    //     console.log(tempArray);
    //     return tempArray;
    // }

    useEffect(() => {
        if (loading) {
            return;
        } if (!user || !uid) {
            return navigate("/");
        } if (rendering) {
            getSubmittedRequests();
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            // console.log(submittedRequests);
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
                    submittedRequestsLink={`/submitted-requests/${uid}/${isIdentifier}/${isOwner}`}>
                </NavBar>
                <div className="submitted-requests">
                    <p className="page-message">{messageContent}</p>
                    <div className="submitted-requests-container">
                        {submittedRequests.map((val, key) => {
                            return <div
                                className="submitted-request-card"
                                key={key}>
                                <SubmittedRequestCard
                                    uid={uid}
                                    isIdentifier={isIdentifier}
                                    isOwner={isOwner}
                                    id={val.req_id}
                                    dateSubmitted={val.req_date}
                                    lastUpdated={val.req_updated}
                                    status={val.req_rejected.data[0] === 1 ? "Rejected" : getStatus(val.req_status)}
                                    approved={getApprovalStatus(val.req_approved.data[0])}
                                    submitter={val.req_submitter}
                                    identifiers={val.req_identifiers}
                                    scopeType={getScopeType(val.req_scope_type)}
                                    department={getDepartment(val.req_dept)}
                                    description={val.req_descr}
                                    value={getValue(val.req_value)}
                                    rsn_rejected={val.rsn_rejected ? val.rsn_rejected : ""}
                                    comments={val.req_comments === "" || val.req_comments === null ? "None" : val.req_comments}
                                    editButtonDisabled={val.req_approved.data[0] === 1 || val.req_rejected.data[0] == 1}>
                                </SubmittedRequestCard>
                            </div>
                        })}
                    </div>

                </div>
            </Fragment>
        // <div className="submitted-requests-container">
        //     <p className="page-message">{messageContent}</p>
        //     {submittedRequests.map((val, key) => {
        //         return <div
        //             key={key}
        //             className="request-info-container"
        //             style={{ visibility: submittedRequests.length === 0 ? "hidden" : "visible", marginTop: key === 0 ? "0" : "20px" }}>
        //             <p className="request-id">
        //                 <b>Request ID</b><br />{val.req_id}
        //             </p>
        //             <p className="request-date-submitted">
        //                 <b>Request Submitted</b><br />{val.req_date}
        //             </p>
        //             <p className="request-last-updated">
        //                 <b>Request Updated</b><br />{val.req_updated}
        //             </p>
        //         </div>
        //     })}
        // </div>
        // </Fragment >
    );
}

export default SubmittedRequests;