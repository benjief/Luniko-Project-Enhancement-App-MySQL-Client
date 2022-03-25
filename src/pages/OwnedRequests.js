import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import Axios from "axios";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import OwnedRequestCard from "../components/OwnedRequestCard";
import {
    getStatus,
    getScopeType,
    getDepartment,
    getValue,
    getEffort,
    getPriority,
    getApprovalStatus
} from "../components/DecoderFunctions";
import "../styles/OwnedRequests.css";
import "../styles/CardComponents.css";

function OwnedRequests() {
    const [user, loading] = useAuthState(auth);
    const [rendering, setRendering] = useState(true);
    const navigate = useNavigate();
    const { uid, isIdentifier, isOwner } = useParams();
    const [ownedRequests, setOwnedRequests] = useState([]);
    const [messageContent, setMessageContent] = useState("You aren't the owner of any requests!");
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

    const getOwnedRequests = () => {
        Axios.get(`https://luniko-pe.herokuapp.com/get-owned-requests-for-id/${uid}`, {
        }).then((response) => {
            // setOwnedRequests(response.data);
            if (response.length !== 0) {
                setMessageContent("Your owned requests:");
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
                    // console.log("added identifier " + i);
                }
                requestList[i].req_identifiers = submittedIdentifiers;
            });
        }
        setOwnedRequests([...requestList]);
        setRendering(false);
    };

    // const handleModifyRequestCallback = (requestFromCard) => {
    //     navigate(`/modify-owned-request/${user?.uid}/${isIdentifier}/${isOwner}`);
    // }

    useEffect(() => {
        if (loading) {
            return;
        } if (!user || !uid) {
            !user ? console.log("no user") : console.log("no uid");
            return navigate("/");
        } if (rendering) {
            getOwnedRequests();
        }
        else {
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
                <div className="owned-requests">
                    <p className="page-message">{messageContent}</p>
                    <div className="owned-requests-container">
                        {ownedRequests.map((val, key) => {
                            return <div
                                className="owned-request-card"
                                key={key}>
                                <OwnedRequestCard
                                    uid={uid}
                                    isIdentifier={isIdentifier}
                                    isOwner={isOwner}
                                    id={val.req_id}
                                    status={val.req_rejected.data[0] === 1 ? "rejected" : getStatus(val.req_status)}
                                    dateSubmitted={val.req_date}
                                    lastUpdated={val.req_updated}
                                    company={val.req_company}
                                    submitter={val.req_submitter}
                                    identifiers={val.req_identifiers}
                                    scopeType={getScopeType(val.req_scope_type)}
                                    department={getDepartment(val.req_dept)}
                                    description={val.req_descr}
                                    value={getValue(val.req_value)}
                                    effort={getEffort(val.req_effort)}
                                    priority={val.req_priority === 0 ? "TBD" : getPriority(val.req_priority)}
                                    approved={getApprovalStatus(val.req_approved.data[0])}
                                    rejected={getApprovalStatus(val.req_rejected.data[0])}
                                    rsn_rejected={val.rsn_rejected ? val.rsn_rejected : "None"}
                                    comments={val.req_comments === "" || val.req_comments === null ? "None" : val.req_comments}
                                    /* toModify={handleModifyRequestCallback} */>
                                </OwnedRequestCard>
                            </div>
                        })}
                    </div>

                </div>
            </Fragment>
    );
}

export default OwnedRequests;