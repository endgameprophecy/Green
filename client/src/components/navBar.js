import React, { Component, Fragment } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Logout from './logout.js';


class NavBar extends Component {
    state = {
        isOpen: false
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        console.log(this.props.auth.user);
        console.log(user);
        const authLinks = (
            <Fragment>              
                <NavItem>
                    <NavLink>
                        <Link style={{ color: "#10aa50"}} to="/Map"><strong>MAP</strong></Link>
                    </NavLink> 
                </NavItem>
                <NavItem>
                    <NavLink>
                        <Link style={{ color: "#10aa50"}} to="/Profile"><strong>PROFILE</strong></Link>
                    </NavLink> 
                </NavItem>
                <NavItem>
                    <Logout/>
                </NavItem>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <NavItem>
                </NavItem>
            </Fragment>
        );

        return(
            <div className="SectionNavBar">
                <Navbar expand="sm" className="NavBar">
                    <NavbarBrand href="/">
                        <h1 className="ProductName"><strong>CryptoGreen</strong></h1>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            { isAuthenticated ? authLinks : guestLinks }
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user
});

export default connect(mapStateToProps, null)(NavBar);