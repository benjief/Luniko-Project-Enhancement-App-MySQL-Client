import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Popover,
    PopoverBody
} from "reactstrap";

class RegistrationPopover extends Component {
    constructor() {
        super();
        this.state = { popoverOpen: false };
        this.togglePopover = this.togglePopover.bind(this);
    };

    togglePopover() {
        this.setState({ popoverOpen: !this.state.popoverOpen });
    }

    render() {
        const { popoverOpen } = this.state;

        return (
            <div className="register-popover-container" style={{ marginTop: "0" }}>
                <img
                    id="popover-icon"
                    src={require("../img/question_mark_icon.png")}
                    style={{ width: "35px" }}
                />
                <Popover
                    placement="bottom"
                    isOpen={popoverOpen}
                    target="popover-icon"
                    toggle={this.togglePopover}

                >
                    <PopoverBody
                        style={{
                            fontFamily: "'Raleway', Verdana, Geneva, Tahoma, sans-serif"
                        }}>
                        A <b>valid email address</b> and password length
                        of <b>at least six characters</b> are required for registration.
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default RegistrationPopover;