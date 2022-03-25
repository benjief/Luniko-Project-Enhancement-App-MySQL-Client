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
    getScopeType,
    getDepartment,
    getValue
} from "../components/DecoderFunctions";
// import { stringify } from "@firebase/util";
import EditSubmittedRequestCard from "../components/EditSubmittedRequestCard";
import "../styles/SelectorComponents.css";
import "../styles/CardComponents.css";
import "../styles/InputComponents.css";
import "../styles/EditSubmittedRequest.css";
import "../styles/AlertComponents.css";

function EditSubmittedRequest() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const { uid, isIdentifier, isOwner, reqID } = useParams();
    const [rendering, setRendering] = useState(true);
    const [requestDetails, setRequestDetails] = useState([]);
    const [company, setCompany] = useState("");
    const [scopeType, setScopeType] = useState("");
    const [department, setDepartment] = useState("");
    const [value, setValue] = useState("");
    const [identifierOptions, setIdentifierOptions] = useState([]);
    const [selectedIdentifiers, setSelectedIdentifiers] = useState([]);
    const [description, setDescription] = useState("");
    const [approved, setApproved] = useState("");
    const [rejected, setRejected] = useState("");
    const [valueUpdated, setValueUpdated] = useState(false);
    const [updated, setUpdated] = useState(false);
    // const [updateButtonText, setUpdateButtonText] = useState("Update");
    const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");
    const [alert, setAlert] = useState(false);

    // Single select options
    const scopeOptions = [
        { value: "F", label: "Functional" },
        { value: "TE", label: "Technical" },
        { value: "CO", label: "Conversion" },
        { value: "G", label: "General" },
        { value: "CU", label: "Cutover" },
        { value: "TS", label: "Testing" }
    ];

    const deptOptions = [
        { value: "R", label: "Risk" },
        { value: "A", label: "Action" },
        { value: "I", label: "Issue" },
        { value: "D", label: "Decision" }
    ];

    const valueOptions = [
        { value: 1, label: "Low" },
        { value: 2, label: "Medium" },
        { value: 3, label: "High" },
        { value: 4, label: "Critical" }
    ];


    const getRequestDetails = (id) => {
        Axios.get(`https://luniko-pe.herokuapp.com/get-request-details-for-id/${id}`, {
        }).then((response) => {
            setRequestDetails(response.data);
            let requestInfo = response.data[0];
            setCompany(requestInfo.req_company);
            let scopeType = {
                "value": requestInfo.req_scope_type,
                "label": getScopeType(requestInfo.req_scope_type)
            }
            setScopeType(scopeType);
            let department = {
                "value": requestInfo.req_dept,
                "label": getDepartment(requestInfo.req_dept)
            }
            setDepartment(department);
            let value = {
                "value": requestInfo.req_value,
                "label": getValue(requestInfo.req_value)
            }
            setValue(value);
            setDescription(requestInfo.req_descr);
            setApproved(requestInfo.req_approved.data[0]);
            setRejected(requestInfo.req_rejected.data[0]);
            getAllIdentifiers();
        });
    };

    const getAllIdentifiers = () => {
        Axios.get("https://luniko-pe.herokuapp.com/get-all-personnel", {
        }).then((response) => {
            getSubmittedIdentifiers(response.data, reqID);
        });
    };

    const getSubmittedIdentifiers = (allPersonnel, id) => {
        Axios.get(`https://luniko-pe.herokuapp.com/get-identifiers-for-submitted-request/${id}`, {
        }).then((response) => {
            let submittedIdentifiers = []
            for (let i = 0; i < response.data.length; i++) {
                submittedIdentifiers.push(response.data[i].pers_id);
            }
            populateIdentifierList(allPersonnel, submittedIdentifiers);
        })
    }

    const populateIdentifierList = (allPersonnel, submittedIdentifiers) => {
        if (allPersonnel.length > 1) {
            let tempArray = [];
            for (let i = 0; i < allPersonnel.length; i++) {
                if (allPersonnel[i].pers_id !== uid && !submittedIdentifiers.includes(allPersonnel[i].pers_id)) {
                    let value = allPersonnel[i].pers_id;
                    let label = allPersonnel[i].pers_fname + " " + allPersonnel[i].pers_lname;
                    let email = allPersonnel[i].pers_email;
                    let identifier = {
                        "value": value,
                        "label": label,
                        "description": email
                    };
                    tempArray.push(identifier);
                }
            }
            setIdentifierOptions(tempArray);
        }
        setRendering(false);
    }

    const checkValueUpdated = () => {
        if (!valueUpdated) {
            setValueUpdated(true);
        }
    }

    // Selector callback handlers
    const handleCompanyCallback = (companyFromTextInput) => {
        setCompany(companyFromTextInput);
        checkValueUpdated();
    }

    const handleScopeCallback = (scopeFromSelector) => {
        setScopeType(scopeFromSelector);
        checkValueUpdated();
    }

    const handleDeptCallback = (deptFromSelector) => {
        setDepartment(deptFromSelector);
        checkValueUpdated();
    }

    const handleDescriptionCallback = (descriptionFromTextInput) => {
        setDescription(descriptionFromTextInput);
        checkValueUpdated();
    }

    const handleValueCallback = (valueFromSelector) => {
        setValue(valueFromSelector);
        checkValueUpdated();
    }

    const handleIdentifierCallback = (identifiersFromSelector) => {
        setSelectedIdentifiers(identifiersFromSelector);
        checkValueUpdated();
    }

    const updateRequest = (idFromCard) => {
        console.log("Updating request...");
        Axios.put("https://luniko-pe.herokuapp.com/update-submitted-request", {
            company: company,
            scopeType: scopeType.value ? scopeType.value : scopeType,
            department: department.value ? department.value : department,
            description: description,
            value: value.value ? value.value : value,
            id: idFromCard
        }).then((response) => {
            setUpdated(true); //TODO: are these needed?
            console.log("Request successfully updated!!");
            if (selectedIdentifiers.length !== 0) {
                addIdentifications(idFromCard);
            } else {
                setAlert(true);
            }
        });
    };

    const addIdentifications = (requestID) => {
        console.log("Moving on to identifications...")
        for (let i = 0; i < selectedIdentifiers.length; i++) {
            Axios.post("https://luniko-pe.herokuapp.com/create-identification", {
                uid: selectedIdentifiers[i].value,
                req_id: requestID
            }).then((response) => {
                setAlert(true);
            });
        };
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
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!approved && !rejected && valueUpdated && company.trim() !== "" && scopeType !== "" && department !== "" && value !== "" && description.trim() !== "") {
                setUpdateButtonDisabled(false);
            } else {
                setUpdateButtonDisabled(true);
            }
        }
    }, [loading, user, rendering, valueUpdated, company, scopeType, department, description, value]);

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
                <div className="edit-submitted-request">
                    <div className="edit-submitted-request-container">
                        <div className="page-heading">
                            Edit your request below:
                        </div>
                        {requestDetails.map((val, key) => {
                            return <div
                                className="edit-submitted-request-card"
                                key={key}>
                                <EditSubmittedRequestCard
                                    id={val.req_id}
                                    company={val.req_company}
                                    updatedCompany={handleCompanyCallback}
                                    scopeType={scopeType}
                                    scopeTypeOptions={scopeOptions}
                                    updatedScopeType={handleScopeCallback}
                                    department={department}
                                    departmentOptions={deptOptions}
                                    updatedDepartment={handleDeptCallback}
                                    description={val.req_descr}
                                    updatedDescription={handleDescriptionCallback}
                                    value={value}
                                    valueOptions={valueOptions}
                                    updatedValue={handleValueCallback}
                                    identifierOptions={identifierOptions}
                                    addedIdentifiers={handleIdentifierCallback}
                                    requestToUpdate={updateRequest}
                                    updateButtonDisabled={updateButtonDisabled}>
                                </EditSubmittedRequestCard>
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

export default EditSubmittedRequest;