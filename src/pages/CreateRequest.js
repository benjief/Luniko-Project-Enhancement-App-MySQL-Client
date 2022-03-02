import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import CreateRequestCard from "../components/CreateRequestCard";
import Axios from "axios";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/CreateRequest.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";

function CreateRequest() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const { uid, isIdentifier, isOwner } = useParams();
    const [rendering, setRendering] = useState(true);
    const [company, setCompany] = useState("");
    const [scopeType, setScopeType] = useState("");
    const [department, setDepartment] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [identifierOptions, setIdentifierOptions] = useState([]);
    const [selectedIdentifiers, setSelectedIdentifiers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonText, setSubmitButtonText] = useState("Submit");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [transitionElementOpacity, setTransitionElementOpacity] = useState("100%");
    const [transtitionElementVisibility, setTransitionElementVisibility] = useState("visible");

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


    // Identifier functions
    const getIdentifiers = () => {
        console.log("getting identifiers");
        Axios.get("https://luniko-pe.herokuapp.com/get-all-personnel", {
        }).then((response) => {
            populateIdentifierList(response.data);
        });
    };

    const populateIdentifierList = (identifierList) => {
        if (identifierList.length > 1) {
            let tempArray = [];
            for (let i = 0; i < identifierList.length; i++) {
                if (identifierList[i].pers_id !== uid) {
                    let value = identifierList[i].pers_id;
                    let label = identifierList[i].pers_fname + " " + identifierList[i].pers_lname;
                    let identifier = {
                        "value": value,
                        "label": label
                    };
                    tempArray.push(identifier);
                }
            }
            setIdentifierOptions(tempArray);
        }
        setRendering(false);
    }

    // Selector callback handlers
    const handleCompanyCallback = (companyFromSelector) => {
        setCompany(companyFromSelector);
    }

    const handleScopeCallback = (scopeFromSelector) => {
        setScopeType(scopeFromSelector);
    }

    const handleDeptCallback = (deptFromSelector) => {
        setDepartment(deptFromSelector);
    }

    const handleDescriptionCallback = (descriptionFromSelector) => {
        setDescription(descriptionFromSelector);
    }

    const handleValueCallback = (valueFromSelector) => {
        setValue(valueFromSelector);
    }

    const handleIdentifierCallback = (identifiersFromSelector) => {
        setSelectedIdentifiers(identifiersFromSelector);
    }

    const addRequest = (uidFromCallback) => {
        console.log(uidFromCallback);
        console.log("Adding request...");
        Axios.post("https://luniko-pe.herokuapp.com/create-request", {
            uid: uidFromCallback,
            company: company,
            scopeType: scopeType,
            department: department,
            description: description,
            value: value
        }).then((response) => {
            setSubmitted(true);
            console.log("Request successfully added!!");
            if (selectedIdentifiers.length !== 0) {
                addIdentifications(response.data.insertId);
            } else {
                handleSuccessfulSubmit();
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
                console.log("Identification successfully added!");
                handleSuccessfulSubmit();
            });
        };
    };

    const handleSuccessfulSubmit = () => {
        // setTimeout(() => {
        //     setSubmitButtonText("Request Submitted!");
        // }, 500);
        setTimeout(() => {
            navigate("/dashboard");
        }, 1000);
    }

    useEffect(() => {
        if (loading) {
            return;
        } if (!user) {
            return navigate("/");
        } if (rendering) {
            getIdentifiers();
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (company !== "" && scopeType !== "" && department !== "" && value !== "" && description.length) {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
    }, [loading, user, company, scopeType, department, value, rendering, description]);

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
                    srDisabled={!(isIdentifier === "true")}
                    orDisabled={!(isOwner === "true")}
                    createRequestLink={`/create-request/${uid}/${isIdentifier}/${isOwner}`}
                    submittedRequestsLink={`/submitted-requests/${uid}/${isIdentifier}/${isOwner}`}
                    ownedRequestsLink={`/owned-requests/${user?.uid}/${isIdentifier}/${isOwner}`}>
                </NavBar>
                <div className="create-request">
                    <div className="create-request-container">
                        <div className="create-request-card">
                            <CreateRequestCard
                                uid={uid}
                                scopeTypeOptions={scopeOptions}
                                departmentOptions={deptOptions}
                                valueOptions={valueOptions}
                                identifierOptions={identifierOptions}
                                updatedCompany={handleCompanyCallback}
                                selectedScopeType={handleScopeCallback}
                                selectedDepartment={handleDeptCallback}
                                updatedDescription={handleDescriptionCallback}
                                selectedValue={handleValueCallback}
                                selectedIdentifiers={handleIdentifierCallback}
                                requestToSubmit={addRequest}
                                submitButtonDisabled={submitButtonDisabled}>
                            </CreateRequestCard>
                        </div>
                        {/* <input
                            className="request-textBox"
                            type="text"
                            value={company}
                            onChange={(event) => setCompany(event.target.value)}
                            maxLength={45}
                            required={true}
                            placeholder="Company Name">
                        </input>
                        <MaterialSingleSelect
                            placeholder="Scope Type"
                            singleSelectOptions={scopeOptions}
                            selectedValue={handleScopeCallback}>
                        </MaterialSingleSelect>
                        <MaterialSingleSelect
                            placeholder="Department"
                            singleSelectOptions={deptOptions}
                            selectedValue={handleDeptCallback}>
                        </MaterialSingleSelect>
                        <textarea
                            className="request-textBox"
                            type="text"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Description"
                            maxLength={500}
                            required={true}
                            style={{ marginTop: "10px", height: "150px" }}>
                        </textarea>
                        <MaterialSingleSelect
                            placeholder="Value"
                            singleSelectOptions={valueOptions}
                            selectedValue={handleValueCallback}>
                        </MaterialSingleSelect>
                        <MaterialMultiSelect
                            label="Identifiers"
                            placeholder="Add Identifiers"
                            multiSelectOptions={identifierOptions}
                            selectedValues={handleIdentifierCallback}
                            limitTags={1}>
                        </MaterialMultiSelect>
                        <button
                            className="submit-request-button"
                            disabled={disabled}
                            // TODO: this might not be super necessary
                            onClick={!submitted ? addRequest : null}
                            style={{ backgroundColor: submitButtonColor }}>
                            {submitButtonText}
                        </button> */}
                    </div>
                </div>
            </Fragment >
    )
}

export default CreateRequest;