import React, { Fragment, useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MaterialSingleSelect from "../components/MaterialSingleSelect";
import MaterialMultiSelect from "../components/MaterialMultiSelect";
import CreateRequestCard from "../components/CreateRequestCard";
import PositionedSnackbar from "../components/PositionedSnackbar";
import Axios from "axios";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import "../styles/CreateRequest.css";
import "../styles/SelectorComponents.css";
import "../styles/InputComponents.css";
import "../styles/AlertComponents.css";

function CreateRequest() {
    const [user, loading] = useAuthState(auth);
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
    const activeError = useRef(false);
    const [alert, setAlert] = useState(false);
    const alertType = useRef("success-alert");
    const alertMessage = useRef("Request successfully submitted!");
    const loadErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to re-load this page.");
    const writeErrorMessage = useRef("Apologies! We've encountered an error. Please attempt to re-submit your request.");
    const [displaySubmitButtonWorkingIcon, setDisplaySubmitButtonWorkingIcon] = useState(false);
    const async = useRef(false);

    const navigate = useNavigate();

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

    const runReadAsyncFunctions = async () => {
        await getIdentifiers();
    }


    // Identifier functions
    const getIdentifiers = async () => {
        console.log("fetching identifiers");
        try {
            async.current = true;
            await Axios.get("https://luniko-pe.herokuapp.com/get-all-personnel", {
            }).then(response => {
                populateIdentifierList(response.data);
            });
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    };

    const populateIdentifierList = (identifierList) => {
        console.log("populating identifier list");
        try {
            if (identifierList.length > 1) { // there's no sense in running the code below if the current user is the only identifier
                let tempArray = [];
                for (let i = 0; i < identifierList.length; i++) {
                    if (identifierList[i].pers_id !== uid) {
                        let value = identifierList[i].pers_id;
                        let label = identifierList[i].pers_fname + " " + identifierList[i].pers_lname;
                        let email = identifierList[i].pers_email;
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
            async.current = false;
            setRendering(false);
        } catch (err) {
            console.log("error caught:", err);
            handleError("r");
        }
    }

    // Selector callback handlers
    const handleCompanyCallback = (companyFromTextInput) => {
        setCompany(companyFromTextInput);
    }

    const handleScopeCallback = (scopeFromSelector) => {
        setScopeType(scopeFromSelector);
    }

    const handleDeptCallback = (deptFromSelector) => {
        setDepartment(deptFromSelector);
    }

    const handleDescriptionCallback = (descriptionFromTextInput) => {
        setDescription(descriptionFromTextInput);
    }

    const handleValueCallback = (valueFromSelector) => {
        setValue(valueFromSelector);
    }

    const handleIdentifierCallback = (identifiersFromSelector) => {
        setSelectedIdentifiers(identifiersFromSelector);
    }

    const runWriteAsyncFunctions = async (uidFromCallback) => {
        let requestID = await addRequest(uidFromCallback);
        try {
            if (selectedIdentifiers.length !== 0) {
                await addIdentifications(requestID);

            } else {
                setAlert(true);
            }
        } catch (err) {
            console.log("error caught:", err);
            handleError("w");
        }
    }

    const addRequest = async (uidFromCallback) => {
        setSubmitButtonDisabled(true);
        setDisplaySubmitButtonWorkingIcon(true);
        console.log("adding request");
        try {
            async.current = true;
            let tempArray = [];
            await Axios.post("https://luniko-pe.herokuapp.com/create-request", {
                uid: uidFromCallback,
                company: company,
                scopeType: scopeType,
                department: department,
                description: description,
                value: value
            }).then(response => {
                async.current = false;
                tempArray.push(response.data.insertId);
                setSubmitted(true); // TODO: is this needed?
            });
            return tempArray;
        } catch (err) {
            console.log("error caught:", err);
            handleError("w");
        }
    }

    const addIdentifications = async (requestID) => {
        if (!async.current) {
            console.log("adding identifications");
            try {
                async.current = true;
                for (let i = 0; i < selectedIdentifiers.length; i++) {
                    await Axios.post("https://luniko-pe.herokuapp.com/create-identification", {
                        uid: selectedIdentifiers[i].value,
                        req_id: requestID
                    }).then(response => {
                        async.current = false;
                        setAlert(true);
                    });
                }
            } catch (err) {
                // delete the request if identifications can't be added
                await Axios.delete(`https://luniko-pe.herokuapp.com/remove-request/${requestID}`, {
                }).then(response => {
                    console.log("request successfully removed");
                    console.log("error caught:", err);
                    handleError("w");
                });
            }
        }
    }

    const handleError = (errorType) => {
        activeError.current = true;
        alertType.current = "error-alert";
        errorType === "r"
            ? alertMessage.current = loadErrorMessage.current
            : alertMessage.current = writeErrorMessage.current;

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
            navigate(`/dashboard/"personnelOkay"`);
        }
    }

    useEffect(() => {
        if (loading) {
            return;
        } if (!user) {
            return navigate("/");
        } if (rendering) {
            runReadAsyncFunctions();
        } else {
            setTransitionElementOpacity("0%");
            setTransitionElementVisibility("hidden");
            if (!async.current && company.trim() !== "" && scopeType !== "" && department !== "" && value !== "" && description.trim() !== "") {
                setSubmitButtonDisabled(false);
            } else {
                setSubmitButtonDisabled(true);
            }
        }
    }, [loading, user, rendering, async, company, scopeType, department, value, description]);

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
                        srDisabled={!(isIdentifier === "true")}
                        orDisabled={!(isOwner === "true")}
                        createRequestLink={`/create-request/${uid}/${isIdentifier}/${isOwner}`}
                        submittedRequestsLink={`/submitted-requests/${uid}/${isIdentifier}/${isOwner}`}
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
                    <div className="create-request">
                        <div className="create-request-container">
                            <div className="page-heading">
                                Create Your Request:
                            </div>
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
                                    requestToSubmit={runWriteAsyncFunctions}
                                    submitButtonDisabled={submitButtonDisabled}
                                    displayFadingBalls={displaySubmitButtonWorkingIcon}>
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