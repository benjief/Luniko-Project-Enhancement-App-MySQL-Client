import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarToggler,
    Collapse
} from "reactstrap";
import "./Home.css";

class Home extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        return (
            <div>
                <Navbar
                    // color="success"
                    dark
                    expand="md"
                    fixed=""
                    light
                >
                    <NavbarBrand href="/home">
                        <img src={require("../img/logo.png")} alt=""></img>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse navbar isOpen={this.state.collapse}>
                        <Nav
                            className="me-auto"
                            navbar
                        >
                            <NavItem>
                                <NavLink href="/components/">
                                    Create
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/components/">
                                    View
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/reactstrap/reactstrap">
                                    Logout
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Home;