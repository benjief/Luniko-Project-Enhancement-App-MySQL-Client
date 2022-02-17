import "../styles/Personnel.css";
import { useState } from "react";
import Axios from "axios";
import React from "react";

function Personnel() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [personnelList, setPersonnelList] = useState([]);
    const [personnelListVisibility, setPersonnelListVisibility] = useState(false);

    // const displayinfo = () => {
    //   console.log(firstName + lastName + email + phone + company);
    // }

    const addPersonnel = () => {
        // Sending an object (body) if include comma after address
        // Also note that this is a promise
        Axios.post("http://localhost:3001/create-personnel", {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            company: company
        }).then(() => {
            // Adding a value to array in React.js without using the push method (note the variable names)
            setPersonnelList([
                ...personnelList,
                {
                    pers_fname: firstName,
                    pers_lname: lastName,
                    pers_email: email,
                    pers_phone: phone,
                    pers_company: company
                },
            ]);
        });
    };

    // Here, you're receiving a response from the back end (goes in .then())
    const getPersonnel = () => {
        setPersonnelListVisibility(true);
        Axios.get("http://localhost:3001/get-all-personnel", {
        }).then((response) => {
            setPersonnelList(response.data);
        });
    };

    const deletePersonnel = (id) => {
        Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
            setPersonnelList(personnelList.filter((val) => {
                return val.pers_id !== id;
            }));
        });
    }

    const hidePersonnelList = () => {
        setPersonnelListVisibility(false);
    }

    return (
        <div className="Personnel">
            <div className="enter-information">
                <label>First Name: </label>
                <input type="text"
                    onChange={(event) => {
                        setFirstName(event.target.value);
                    }}
                />
                <label>Last Name: </label>
                <input type="text"
                    onChange={(event) => {
                        setLastName(event.target.value);
                    }}
                />
                <label>Email: </label>
                <input type="email"
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <label>Phone: </label>
                <input type="tel"
                    onChange={(event) => {
                        setPhone(event.target.value);
                    }}
                />
                <label>Company: </label>
                <input type="text"
                    onChange={(event) => {
                        setCompany(event.target.value);
                    }}
                />
                <button onClick={addPersonnel}>Add Personnel</button>
            </div>
            <div className="show-information">
                <button onClick={getPersonnel}>Show Personnel</button>
                <button id="hide-personnel-button" onClick={hidePersonnelList}>Hide Personnel</button>
                <div className="personnel-list" style={{ visibility: personnelListVisibility ? "visible" : "hidden" }}>
                    {/* This is how you render a list with React.js -> map through every element in the list */}
                    {personnelList.map((val, key) => {
                        // val is the current personnel (object); also note that the attribute you're pulling must match your DB
                        return <div className="personnel-info-container">
                            <p className="personnel-name">
                                {val.pers_fname} {val.pers_lname}
                            </p>
                            <p className="personnel-email">
                                {val.pers_email}
                            </p>
                            <p className="personnel-phone">
                                {val.pers_phone}
                            </p>
                            <p className="personnel-company">
                                {val.pers_company}
                            </p>
                            <button onClick={() => {
                                deletePersonnel(val.pers_id)
                            }}>Delete</button>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
}

export default Personnel;