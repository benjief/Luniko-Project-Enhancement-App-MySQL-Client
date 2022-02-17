import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Popover,
    PopoverBody
} from "reactstrap";

class BootstrapPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popoverOpen: false,
            popoverText: this.props.popoverText
        };
        this.togglePopover = this.togglePopover.bind(this);
    };

    togglePopover() {
        this.setState({ popoverOpen: !this.state.popoverOpen });
    }

    render() {
        const { popoverOpen, popoverText } = this.state;

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
                        {popoverText}
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default BootstrapPopover;