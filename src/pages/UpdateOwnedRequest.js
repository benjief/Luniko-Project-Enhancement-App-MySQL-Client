import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Axios from "axios";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import {
    getStatus,
    getScopeType,
    getDepartment,
    getValue,
    getEffort,
    getPriority,
    getApprovalStatus
} from "../components/DecoderFunctions";
// import { stringify } from "@firebase/util";
import UpdateOwnedRequestCard from "../components/UpdateOwnedRequestCard";
import "../styles/SelectorComponents.css";
import "../styles/CardComponents.css";
import "../styles/InputComponents.css";
import "../styles/UpdateOwnedRequest.css";
import "../styles/AlertComponents.css";

function UpdateOwnedRequest() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const { uid, isIdentifier, isOwner, reqID } = useParams();
    const [rendering, setRendering] = useState(true);
    const [requestDetails, setRequestDetails] = useState([]);
    const [value, setValue] = useState("");
    const [effort, setEffort] = useState("");
    const [priority, setPriority] = useState(0);
    const [approved, setApproved] = useState(0);
    const [rejected, setRejected] = useState(0);
    const [reasonRejected, setReasonRejected] = useState("");
    const [status, setStatus] = useState("");
    const [comments, setComments] = useState("");
    const [rejectDisabled, setRejectDisabled] = useState(true);
    const [approveDisabled, setApproveDisabled] = useState(false);
    const [reasonRejectedDisabled, setReasonRejectedDisabled] = useState(false);
    const [valueUpdated, setValueUpdated] = useState(false);
    const [updated, setUpdated] = useState(false);
    // const [updateButtonText, setUpdateButtonText] = useState("Update");
    const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);

    // Update button
    // const activateUpdate = () => {
    //     setUpdateButtonColor("var(--lunikoOrange)");
    //     setUpdateButtonDisabled(false);
    // }

    // const deactivateUpdate = () => {
    //     setUpdateButtonColor("#BFBFBF");
    //     setUpdateButtonDisabled(true);
    // }

    const getRequestDetails = (id) => {
        Axios.get(`https://luniko-pe.herokuapp.com/get-request-details-for-id/${id}`, {
        }).then((response) => {
            let requestDetails = response.data[0];
            let status = {
                "value": requestDetails.req_status,
                "label": getStatus(requestDetails.req_status)
            }
            setStatus(status);
            let effort = {
                "value": requestDetails.req_effort,
                "label": getEffort(requestDetails.req_effort)
            }
            setEffort(effort);
            let requestApproved = {
                "value": requestDetails.req_approved.data[0],
                "label": getApprovalStatus(requestDetails.req_approved.data[0])
            }
            setApproved(requestApproved);
            let requestRejected = {
                "value": requestDetails.req_rejected.data[0],
                "label": getApprovalStatus(requestDetails.req_rejected.data[0])
            }
            setRejected(requestRejected);
            setComments(requestDetails.req_comments);
            let value = {
                "value": requestDetails.req_value,
                "label": getValue(requestDetails.req_value)
            }
            setValue(value);
            if (!approved && response.data.rsn_rejected && response.data.rsn_rejected.length > 0) {
                setRejectDisabled(false);
            } else {
                setRejectDisabled(true);
            }
            setPriority(requestDetails.req_value * requestDetails.req_effort);
            getSubmittedIdentifiers(response.data);
        });
    };

    const getSubmittedIdentifiers = async (requestInfo) => {
        await Axios.get(`https://luniko-pe.herokuapp.com/get-identifier-names-for-submitted-request/${requestInfo[0].req_id}`, {
        }).then((response) => {
            let submittedIdentifiers = []
            for (let i = 0; i < response.data.length; i++) {
                submittedIdentifiers.push(response.data[i].pers_name);
            }
            requestInfo[0].req_identifiers = submittedIdentifiers;
        });
        setRequestDetails(requestInfo);
        setRendering(false);
    };

    // Single select options
    const effortOptions = [
        { value: 0, label: "TBD" },
        { value: 1, label: "High" },
        { value: 2, label: "Medium" },
        { value: 3, label: "Low" }
    ];

    const statusOptions = [
        { value: "C", label: "Completed" },
        { value: "P", label: "In Progress" },
        { value: "I", label: "Issue" },
        { value: "N", label: "Not Started" }
    ];

    const approvalOptions = [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" }
    ];


    const checkValueUpdated = () => {
        if (!valueUpdated) {
            setValueUpdated(true);
        }
    }

    // Selector callback handlers
    const handleStatusCallback = (statusFromSelector) => {
        setStatus(statusFromSelector);
        checkValueUpdated();
    }

    const handleEffortCallback = (effortFromSelector) => {
        setEffort(effortFromSelector);
        setPriority(effortFromSelector * value);
        if (!valueUpdated) {
            setValueUpdated(true);
        }
        checkValueUpdated();
    }

    const handleApprovedCallback = (approvedFromSelector) => {
        setApproved(approvedFromSelector);
        if (approvedFromSelector) {
            setRejectDisabled(true);
            setReasonRejectedDisabled(true);
        } else {
            setReasonRejectedDisabled(false);
            if (reasonRejected !== "") {
                setRejectDisabled(false);
            }
        }
        checkValueUpdated();
    }

    const handleRejectedCallback = (rejectedFromSelector) => {
        setRejected(rejectedFromSelector);
        rejectedFromSelector === 1
            ? setApproveDisabled(true)
            : setApproveDisabled(false);
        checkValueUpdated();
    }

    const handleReasonRejectedChange = (reasonRejectedFromTextArea) => {
        setReasonRejected(reasonRejectedFromTextArea);
        let regex = new RegExp("[a-zA-Z]");
        if (!approved && reasonRejectedFromTextArea.length > 0 && regex.test(reasonRejectedFromTextArea)) {
            setRejectDisabled(false)
        } else {
            setRejectDisabled(true);
            setApproveDisabled(false);
        }
        checkValueUpdated();
    }

    const handleCommentsChange = (commentsFromTextArea) => {
        setComments(commentsFromTextArea);
        checkValueUpdated();
    }

    const updateRequest = (idFromCard) => {
        console.log("Updating request...");
        Axios.put("https://luniko-pe.herokuapp.com/update-owned-request", {
            reasonRejected: rejectDisabled === null ? null : rejected === "" ? null : reasonRejected,
            effort: effort.value ? effort.value : effort,
            approved: !approveDisabled
                ? rejected.value && rejected.value === "" ? 0
                    : rejected === "" ? 0
                        : approved.value ? approved.value : approved : 0,
            rejected: !rejectDisabled
                ? approved.value && approved.value === "" ? 0
                    : approved === "" ? 0
                        : rejected.value ? rejected.value : rejected : 0,
            status: status.value ? status.value : status,
            comments: comments === null ? null : comments === "" ? null : comments,
            id: idFromCard,
        }).then((response) => {
            setUpdated(true);
            console.log("Request successfully updated!");
            setAlert(true);
            // handleAlertClosed(true);
        });
    };

    const handleAlertClosed = (alertClosed) => {
        if (alertClosed) {
            console.log("navigating back");
            setAlert(false);
            navigate(-1);
        }
    }

    useEffect(() => {
        if (loading) {
            return;
        } if (!user) {
            return navigate("/");
        } if (rendering) {
            getRequestDetails(reqID);
        } else {
            if (approved) {
                setReasonRejectedDisabled(true);
            }
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (valueUpdated && status !== "" && effort !== "" && approved !== "") {
                setUpdateButtonDisabled(false);
            } else {
                setUpdateButtonDisabled(true);
            }
        }
    }, [loading, user, rendering, valueUpdated, status, effort, approved, rejected, value, updateButtonDisabled, reasonRejectedDisabled]);

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
                            message="Request successfully updated!"
                            closed={handleAlertClosed}>
                        </PositionedSnackbar>
                    </div>
                    : <div></div>}
                <div className="update-owned-request">
                    <div className="update-owned-request-container">
                        <div className="page-heading">
                            Update your request below:
                        </div>
                        {requestDetails.map((val, key) => {
                            return <div
                                className="update-owned-request-card"
                                key={key}>
                                <UpdateOwnedRequestCard
                                    id={val.req_id}
                                    status={status}
                                    statusOptions={statusOptions}
                                    selectedStatus={handleStatusCallback}
                                    dateSubmitted={val.req_date}
                                    lastUpdated={val.req_updated}
                                    company={val.req_company}
                                    submitter={val.req_submitter}
                                    identifiers={val.req_identifiers}
                                    scopeType={getScopeType(val.req_scope_type)}
                                    department={getDepartment(val.req_dept)}
                                    description={val.req_descr}
                                    value={getValue(val.req_value)}
                                    effort={effort}
                                    effortOptions={effortOptions}
                                    selectedEffort={handleEffortCallback}
                                    priority={getPriority(priority)}
                                    approved={approved}
                                    approveDisabled={approveDisabled}
                                    rejected={rejected}
                                    rejectDisabled={rejectDisabled}
                                    approvalOptions={approvalOptions}
                                    selectedApproved={handleApprovedCallback}
                                    selectedRejected={handleRejectedCallback}
                                    reasonRejected={val.rsn_rejected === null ? "" : val.rsn_rejected}
                                    reasonRejectedDisabled={reasonRejectedDisabled}
                                    updatedReasonRejected={handleReasonRejectedChange}
                                    comments={val.req_comments === null ? "" : val.req_comments}
                                    updatedComments={handleCommentsChange}
                                    requestToUpdate={updateRequest}
                                    updateButtonDisabled={updateButtonDisabled}>
                                </UpdateOwnedRequestCard>
                            </div>
                        })}
                        {/* <button
                            className="update-request-button"
                            // disabled={updateButtonDisabled}
                            // TODO: this might not be super necessary
                            onClick={!updated ? updateRequest : null}
                            style={{ backgroundColor: updateButtonColor }}>
                            {updateButtonText}
                        </button>
                        <BootstrapPopover
                            popoverText=
                            {[<strong>All identifiers </strong>, "added to this request will be ",
                                "able to view it and receive updates pertaining to it."]}>
                        </BootstrapPopover> */}
                    </div>
                </div>
            </Fragment >
    );
}

export default UpdateOwnedRequest;