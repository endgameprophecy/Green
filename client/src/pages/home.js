import React, { Component } from 'react';
import {
    Col,
    Row,
} from 'reactstrap';
import Image from 'react-bootstrap/Image';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fade } from "react-slideshow-image";
import { Icon } from '@iconify/react';
import moneyDollarCircleFill from '@iconify-icons/ri/money-dollar-circle-fill';
import mapIcon from '@iconify-icons/carbon/map';
import connectIcon from '@iconify-icons/carbon/connect';
import 'react-slideshow-image/dist/styles.css';

import Boston from "../images/Boston.png";
import Crypto from "../images/Cryptocurrency.jpg";
import GreenWorld from "../images/GreenWorld.jpeg";
import GreenHouse from "../images/GreenHouse.jpg";
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import LoginModal from "../components/loginModal";


class Home extends Component{
    static propTypes = {
        auth: PropTypes.object.isRequired
    }
    render(){
        const isAuthenticated = this.props.auth.isAuthenticated;
        const info = (
            <div>
                <div className="SectionElevator">
                    <div className="ElevatorPitch">
                        <div class="mx-auto mb-5 mb-lg-0 mb-lg-3">
                            <div class="d-flex"><i class="m-auto"><h3 style={{ marginTop: "130px" }}>Use CryptoGreen to make some extra money and help save the environment.</h3></i></div>
                        </div>
                    </div>
                </div>
                <div className="SectionFeatures">
                    <div className="Features">
                        <Row>
                            <Col md="4">
                                <div class="mx-auto mb-5 mb-lg-0 mb-lg-3">
                                    <div class="d-flex"><i class="m-auto"><Icon icon={moneyDollarCircleFill} className="FeatureIcon"/></i></div>
                                    <h3>Make Money By Completing Tasks!</h3>
                                    <p class="lead mb-0">Earn a set amount of 5 XLM plus some extra by cleaning up the environment</p>
                                </div>
                            </Col>
                            <Col md="4">
                                <div class="mx-auto mb-5 mb-lg-0 mb-lg-3">
                                    <div class="d-flex"><i class="m-auto"><Icon icon={mapIcon} className="FeatureIcon"/></i></div>
                                    <h3>Find Tasks All Around The World!</h3>
                                    <p class="lead mb-0">Check out tasks from all over the globe with our user friendly interface</p>
                                </div>
                            </Col>
                            <Col md="4">
                                <div class="mx-auto mb-5 mb-lg-0 mb-lg-3">
                                    <div class="d-flex"><i class="m-auto"><Icon icon={connectIcon} className="FeatureIcon"/></i></div>
                                    <h3>Connect With Your Employer!</h3>
                                    <p class="lead mb-0">You will be able to contact your employer for your task using our convenient chat application</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
        const authLinks = (
            <div className="slide-container">
                <Fade>
                    <div className="each-fade">
                        <Image className="homeImage" src={Boston}/>
                    </div>
                    <div className="each-fade">
                        <Image className="homeImage" src={GreenWorld}/>
                    </div>
                    <div className="each-fade">
                        <Image className="homeImage" src={Crypto}/>
                    </div>
                </Fade>
            </div>
        );
        const guestLinks = (
            <div>
                <div className="SectionSignLog">
                    <div className="SignLog">
                        <Row>
                            <Col md="8">
                                <Image className="ImageSign" src={GreenHouse} roundedCircle/>
                            </Col>
                            <Col md="4" className="Modal">
                                <LoginModal/>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );

        return(
            <div>
                <NavBar/>
                    { isAuthenticated ? authLinks : guestLinks }
                    {info}
                <Footer/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(Home);
