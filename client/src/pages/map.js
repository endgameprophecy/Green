import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Fade } from "react-slideshow-image";
import PropTypes from "prop-types";
import Image from 'react-bootstrap/Image';
import { Icon } from '@iconify/react';
import axios from "axios";
import moneyDollarCircleFill from '@iconify-icons/ri/money-dollar-circle-fill';
import {
  TileLayer,
  Map,
  Marker, 
  Popup
} from "react-leaflet";
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

import { customIcon } from "../components/markerIcon";
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import { getUser } from "../actions/userActions";
import { registerTask, getTasks, updateTask, deleteTask } from '../actions/taskActions';
import { getImage, uploadImage } from '../actions/imageActions';
import { clearErrors } from "../actions/errorActions";
import "leaflet/dist/leaflet.css";


class MyMap extends Component{
    static propTypes = {
        auth: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired
    }
    constructor(props){
        super(props);
        this.state = {
            userId: "",
            currUser: null,
            name: "",
            data: [],
            addMarker: {},
            strAdd: "",
            displayAdd: "",
            date: "",
            pictureLink: "",
            description: "",
            taskImages: [],
            currTask: null,
            modalOpen: false,
            getMoreInfo: false,
            value: 0,
        };
        this.fetchData = this.fetchData.bind(this);
        this.toggle = this.toggle.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.claimTask = this.claimTask.bind(this);
        this.delete = this.delete.bind(this);
        this.uploadImageTask = this.uploadImageTask.bind(this);
        this.loadImages = this.loadImages.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    async fetchData(){
        const type = this.props.user.userType;
        const userId = this.props.user.id;
        const name = this.props.user.name;
        this.setState({ userId: userId, name: name });
        await this.props.getTasks({type, userId})
            .then(data => {
                this.setState({
                    ...this.state,
                    data
                });
            })
    }
    async componentDidMount(){
        console.log(this.props.user);
        const type = this.props.user.user.userType;
        const userId = this.props.user.user.id;
        const name = this.props.user.user.name;
        console.log("Userid", userId);
        this.setState({ userId: userId, name: name });
        this.props.getUser(userId)
            .then(res => {
                if(!res){
                    throw new Error("Server Error");
                }
                this.setState({
                    currUser: res
                })
            })
        this.props.getTasks({type, userId})
            .then(data => {
                this.setState({
                    ...this.state,
                    data
                });
            })
    }
    toggle(){
        this.props.clearErrors();
        const initialState = {
            data: [],
            addMarker: {},
            strAdd: "",
            displayAdd: "",
            date: "",
            description: "",
            currTask: null,
            modalOpen: false,
            getMoreInfo: false,
            value: 0,
            reasoning: "",
        };
        this.setState(initialState);
    }
    addMarker(e){
        // console.log(this.props.user);
        if (this.props.user.user.userType === "Employer"){
            const { lat, lng } = e.latlng;
            this.getAddress(lat, lng);
            this.setState({
                addMarker: { lat, lng },
                modalOpen: true,
            });
            console.log(this.state.addMarker);
        }
    }
    async getAddress(lat, lng){
        var link = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lng;
        const openstreet = await axios.get(link);
        const data = openstreet.data;
        var address = [data.address.house_number, data.address.road, data.address.county, data.address.state, data.address.postcode, data.address.country];
        console.log(address);
        var displayAddr = (
            <div>
                <div>{address[0] + " " + address[1]}</div>
                <div>{address[2] + ", " + address[3] + ", " + address[4]}</div>
                <div>{address[5]}</div>
            </div>
        );
        var strAdd = address[0] + " " + address[1] + " " + address[2] + ", " + address[3] + ", " + address[4] + ", " + address[5];
        this.setState({
            strAdd: strAdd,
            displayAdd: displayAddr,
        });
    }
    getMoreInfo(){
        this.setState({
            getMoreInfo: true,
        });
    }
    onChange(e){
        this.setState({ [e.target.name]: e.target.value })
    }
    claimTask(e){
        e.preventDefault();
        console.log("Props User", this.props.user);
        console.log("Curr User", this.state.currUser);
        console.log("Curr Task", this.state.currTask);
        console.log(this.state.currUser.secretKey);
        console.log(this.state.currTask.postedSecret);
        const updTask = {
            status: "Claimed",
            claimedBy: this.state.userId,
            claimedName: this.state.name,
            claimedPublic: this.state.currUser.publicKey,
            postedSecret: this.state.currTask.postedSecret,
            address: this.state.currTask.address,
        }
        this.props.updateTask(updTask);
        this.setState({ getMoreInfo: false });
        this.fetchData();
    }
    delete(e){
        e.preventDefault();
        const delTask = {
            address: this.state.currTask.address,
        }
        this.props.deleteTask(delTask);
        this.setState({ getMoreInfo: false });
        this.fetchData();
    }
    uploadImageTask(e) {
        e.preventDefault();
        for(let i = 0; i < e.target.files.length; i++){
            let imageFormObj = new FormData();
            imageFormObj.append("type", "Task");
            imageFormObj.append("address", this.state.strAdd);
            imageFormObj.append("userId", this.props.user.id);
            imageFormObj.append("imageData", e.target.files[i]);
            this.props.uploadImage(imageFormObj);
        }
    }
    loadImages(e, address, postedBy){
        e.preventDefault()
        this.props.getImage({ userId: postedBy, type: "Task", address: address })
            .then(taskImages => {
                if(!taskImages){
                    console.log("no image yet");
                }else{
                    this.setState({
                        ...this.state,
                        taskImages
                    })
                }
            })
    }
    handleSubmit(e){
        e.preventDefault();
        const { lat, lng } = this.state.addMarker;
        const strAdd = this.state.strAdd;
        const value = Number(this.state.value) + 5;
        const description = this.state.description;
        const userId = this.state.userId;
        const postedSecret = this.state.currUser.secretKey;
        const name = this.state.name;
        this.props.registerTask({strAdd, lat, lng, value, description, userId, postedSecret, name});
        this.setState({ modalOpen: false });
        this.fetchData();
    }
    render(){
        let style;
        if(this.state.getMoreInfo){
            style = {
                height: "78vh",
                width: "78%",
            };
        }else{
            style = {
                height: "78vh",
                width: "100%",
            };
        }
        const popupContent = {
            textAlign: "center",
            height: "350px",
            marginTop: "30px"
        };
        const popupHead = {
            fontWeight: "bold",
            fontSize: "22px"
        };
        
        const popupText = {
            fontSize: "15px",
            marginBottom: "20px"
        };
        return(
            <div>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
   integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
   crossOrigin=""/>
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
            integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
            crossOrigin=""></script>
                <NavBar/>
                <div className="mapContent">
                    <Map className="Map" style={style} center={{ lat: 40.7 , lng: -74 }} zoom={15} onClick={this.addMarker}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {this.state.data.map((task, idx) => 
                            <Marker key={`marker-${idx}`} position={{ lat: task.latitude, lng: task.longitude }} icon={ customIcon }>
                                <Popup>
                                    <div style={popupContent}>
                                        {task.status === "Claimed" ? (
                                            <div>
                                                <Image src="data:image/png;base64,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" width="150" height="150"/>
                                                <div className="m-2" style={popupHead}>
                                                    Claimed!
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <Image src="https://cdn3.iconfinder.com/data/icons/basicolor-arrows-checks/24/149_check_ok-512.png" width="150" height="150"/>
                                                <div className="m-2" style={popupHead}>
                                                    Available!
                                                </div>
                                            </div>
                                        )}
                                        <span style={popupText}>
                                            {task.address}
                                        </span>
                                        <div className="moreInfoButton">
                                            {this.state.getMoreInfo ? 
                                                (<Button value={task} onClick={() => this.setState( {getMoreInfo: false })}>Close More Info</Button>) :
                                                (<Button value={task} onClick={(e) => {
                                                    this.setState( {getMoreInfo: true, currTask: task });
                                                    this.loadImages(e, task.address, task.postedBy);
                                                }}>Get More Info</Button>)
                                            }
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </Map>
                    { this.state.getMoreInfo ? (
                        <div className="moreInfo">
                            <Fade>
                                {this.state.taskImages.map((image, idx) => 
                                    <div className="each-fade">
                                        <Image className="taskImages" src= {require(`/Users/winston/Documents/Programming/WebDevelopment/CryptoGreen/uploads/${image.image.split("/")[image.image.split("/").length - 1]}`)}/>
                                    </div>
                                )}
                            </Fade>
                            <div className="mx-2">
                                <Row>
                                    <Col className="text-center">
                                        <h3 className="address">{this.state.currTask.address}</h3>
                                        <hr style={{"width": "20%"}} className="my-4"/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="ml-auto text-center"><i className="m-auto"><Icon icon={moneyDollarCircleFill} className="taskIcon"/></i>
                                        <p>Reward: ${this.state.currTask.value}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-center">
                                        <hr style={{"width": "20%"}} className="my-4"/>
                                        <p className="mx-2">{this.state.currTask.description}</p>
                                    </Col>
                                </Row>
                                {this.state.userId === this.state.currTask.postedBy ? (
                                    <Row>
                                        <Col className="px-5">
                                            <Button onClick={this.delete} block>Delete</Button>
                                        </Col>
                                    </Row>
                                ) : (
                                    <Row>
                                        <Col className="px-5">
                                            <Button onClick={this.claimTask} block>Claim Task</Button>
                                        </Col>
                                    </Row>
                                )}
                            </div>
                        </div>
                    ) : (null)}
                </div>
                <Modal className="registerModal" isOpen={this.state.modalOpen} toggle={this.toggle}>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <div className="text-center">
                                    <h4>{this.state.displayAdd}</h4>
                                </div>
                                <hr/>
                                <InputGroup className="mb-4">
                                    <Input type="number" name="value" id="value" placeholder="Value" onChange={this.onChange}/>
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>$$</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <Input type="file" id="image" name="image" multiple="multiple" value="" onChange={this.uploadImageTask} required/>
                                <br/>
                                <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                    <InputGroupText>Description</InputGroupText>
                                    </InputGroupAddon>
                                    <Input className="h-100" type="textarea" name="description" id="description" onChange={this.onChange}/>
                                </InputGroup>
                                <Row>
                                    <Col className="pl-3 pr-2 mb-0">
                                        <Button onClick={this.toggle} block>Cancel</Button>
                                    </Col>
                                    <Col className="pr-3 pl-2 mb-0">
                                        <Button onClick={this.handleSubmit} block>Register Task</Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
                <Footer/>
            </div>
        )
    }
}


const mapStateToProps =  state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    user: state.auth.user
});

export default connect(mapStateToProps, { registerTask, getUser, getTasks, updateTask, deleteTask, getImage, uploadImage, clearErrors })(MyMap);