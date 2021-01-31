import React, { Component } from 'react';
import {
    Button,
    Col,
    Row,
    Modal,
    ModalBody,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from 'reactstrap';

import { Icon } from '@iconify/react';
import { connect } from 'react-redux';
import { Fade } from "react-slideshow-image";
import PropTypes from 'prop-types';
import bedIcon from '@iconify-icons/fa-solid/bed';
import bathroomIcon from '@iconify-icons/cil/bathroom';
import rulerIcon from '@iconify-icons/raphael/ruler';

import { updateHouse } from "../actions/houseActions";
import { clearErrors } from '../actions/errorActions';
import NewYork from "../images/New York.png";
import Boston from "../images/Boston.png";
import LosAngeles from "../images/Los Angeles.png";
import London from "../images/London.png";

import 'react-slideshow-image/dist/styles.css';

class HouseInfo extends Component{
    static propTypes = {
        auth: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired
    }
    constructor(props){
        super(props);
        this.state = {
            address: this.props.house.address,
            pictureLink: this.props.house.pictureLink,
            bedrooms: this.props.house.bedrooms,
            bathrooms: this.props.house.bathrooms,
            squareFeet: this.props.house.squareFeet,
            description: this.props.house.description,
            date: this.props.house.date,
            status: this.props.house.status,
            value: this.props.house.value,
            postedBy: this.props.house.postedBy,
            reviewedBy: this.props.house.reviewedBy,
            modalOpen: false,
            value: 0,
            reasoning: "",
        }
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e){
        e.preventDefault();
        const userId = this.props.user.user.id;
        const updHouse = {
            reviewedBy: userId,
            address: this.state.address,
            value: this.state.value,
            reasoning: this.state.reasoning,
        }
        this.props.updateHouse(updHouse);
    }
    render(){
        console.log(this.props);
        console.log(this.props.user.user.userType);
        const isAppraiser = this.props.user.user.userType === "Appraiser";
        return(
            <div className="moreInfo">
                <Fade>
                    <div className="each-fade">
                        <img className="houseImages" src={NewYork} />
                    </div>
                    <div className="each-fade">
                        <img className="houseImages" src={Boston} />
                    </div>
                    <div className="each-fade">
                        <img className="houseImages" src={LosAngeles} />
                    </div>
                    <div className="each-fade">
                        <img className="houseImages" src={London} />
                    </div>
                </Fade>
                <div className="mx-2">
                    <Row>
                        <Col className="text-center">
                            <h3 className="address">{this.state.address}</h3>
                            <hr style={{"width": "20%"}} className="my-4"/>
                            {this.state.status ? (
                                <h4 className="mb-5"><strong>Value: {this.state.value} </strong></h4>
                            ) : (
                                <h4 className="mb-5"><strong>Has Yet To Be Evaluated</strong></h4>
                            )}
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col className="ml-auto text-center"><i className="m-auto"><Icon icon={bedIcon} className="houseIcon"/></i>
                            <p>Bed: {this.state.bedrooms}</p>
                        </Col>
                        <Col className="mr-auto text-center"><i className="m-auto"><Icon icon={bathroomIcon} className="houseIcon"/></i>
                            <p>Bath: {this.state.bathrooms}</p>
                        </Col>
                        <Col  className="ml-auto text-center"><i className="m-auto"><Icon icon={rulerIcon} className="houseIcon"/></i>
                            <p>Square Feet: {this.state.squareFeet}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                            <hr style={{"width": "20%"}} className="my-4"/>
                            <p className="mx-2">{this.state.description}</p>
                        </Col>
                    </Row>
                    {this.state.status ? (
                        <Row>
                            <Col className="text-center">
                                <hr style={{"width": "80%"}} className="my-4"/>
                                <p>{this.state.reasoning}</p>
                            </Col>
                        </Row>
                    ) : (null)}
                    {isAppraiser ? (
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <InputGroup className="mb-4">
                                    <Input type="number" name="value" id="value" placeholder="Value" onChange={this.onChange}/>
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>$$</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                    <InputGroupText>Reasoning</InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="textarea" name="reasoning" id="reasoning" onChange={this.onChange}/>
                                </InputGroup>
                                <Row>
                                    <Col className="pl-3 pr-2 mb-0">
                                        <Button onClick={this.toggle} block>Cancel</Button>
                                    </Col>
                                    <Col className="pr-3 pl-2 mb-0">
                                        <Button onClick={this.handleSubmit} block>Finish</Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    ) : (null)}
                </div>
            </div>
        )
    }
}

const mapStateToProps =  state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    user: state.auth.user
});

export default connect(mapStateToProps, { updateHouse, clearErrors })(HouseInfo);