import React, { Component } from 'react';
import { connect } from "react-redux";
import { Icon } from '@iconify/react';
import personCircle from '@iconify-icons/bi/person-circle';
import emailSolid from '@iconify-icons/clarity/email-solid';
import addressBook from '@iconify-icons/el/address-book';
import briefcaseIcon from '@iconify-icons/entypo/briefcase';
import moneyDollarCircleFill from '@iconify-icons/ri/money-dollar-circle-fill';
import piggyBank from '@iconify-icons/carbon/piggy-bank';
import keyFill from '@iconify-icons/bi/key-fill';
import Image from 'react-bootstrap/Image';
import Talk from "talkjs";
import PropTypes from "prop-types";
import {
    Col,
    Row,
    Card,
    CardBody,
    CardGroup,
    CardText,
    CardTitle,
    CardSubtitle,
    Form,
    FormGroup,
    Modal,
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from 'reactstrap';

import { getUser, updateUser } from "../actions/userActions";
import { getTasksInd, updateTask } from "../actions/taskActions";
import { uploadImage, getImage } from "../actions/imageActions";
import { clearErrors } from "../actions/errorActions";
import NavBar from '../components/navBar';
import Footer from '../components/footer';

class Profile extends Component{
    static propTypes = {
        auth: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            role: "",
            bio: "",
            balance: 0,
            publicKey: "",
            secretKey: "",
            tasks: [],
            otherUser: null,
            uploadImage: null,
            image: null,
            editMode: false,
            modalOpen: false,
            showFinancial: false,
        }   
        this.fetchData = this.fetchData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.chatWith = this.chatWith.bind(this);
        this.confirm = this.confirm.bind(this);
        this.markAsCompleted = this.markAsCompleted.bind(this);
        this.toggle = this.toggle.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showFinancial = this.showFinancial.bind(this);
        this.getOtherUser = this.getOtherUser.bind(this);
    }
    async fetchData(){
        const userId = this.props.user.id;
        await this.props.getImage({ userId, type: "Profile", address: "" })
            .then(res => {
                if(!res){
                    console.log("no image yet");
                }else{
                    console.log(res);
                    let tmp = res.image.split("/");
                    this.setState({
                        image: tmp[tmp.length - 1]
                    })
                }
            })
    }
    async componentDidMount() {
        console.log(this.props.user);
        const userId = this.props.user.user.id;
        const type = this.props.user.user.userType;
        console.log(userId,type);
        this.props.getUser(userId)
            .then(res => {
                if(!res){
                    throw new Error("Server Error");
                }
                this.setState({
                    name: res.name,
                    email: res.email,
                    role: res.userType,
                    bio: res.bio,
                    balance: res.balance,
                    publicKey: res.publicKey,
                    secretKey: res.secretKey,
                })
            })
        this.props.getTasksInd({userId, type})
            .then(tasks => {
                if(!tasks){
                    throw new Error("Server Error");
                }
                this.setState({
                    ...this.state,
                    tasks
                })
            })
        this.props.getImage({ userId, type: "Profile", address: "" })
            .then(res => {
                if(!res){
                    console.log("no image yet");
                }else{
                    console.log(res);
                    let tmp = res.image.split("/");
                    this.setState({
                        image: tmp[tmp.length - 1]
                    })
                }
            })
    }
    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onClick(e){
        e.preventDefault();
        this.setState({
            editMode: !this.state.editMode
        });
    }
    toggle(){
        this.props.clearErrors();
        const initialState = {
            modalOpen: false,
        };
        this.setState(initialState);
    }
    openModal(e){
        e.preventDefault();
        this.setState({ modalOpen: true });
    }
    saveEdit(e){
        this.setState({
            editMode: false
        });
        const newUser = {
            isUpdateFinancial: false,
            id: this.props.user.user.id,
            name: this.state.name,
            role: this.state.role,
            bio: this.state.bio,
        }
        this.props.updateUser(newUser);
        e.preventDefault();
    }
    uploadImage(e) {
        e.preventDefault();
        for(let i = 0; i < e.target.files.length; i++){
            let imageFormObj = new FormData();
            imageFormObj.append("type", "Profile");
            imageFormObj.append("userId", this.props.user.user.id);
            imageFormObj.append("imageData", e.target.files[0]);

            this.props.uploadImage(imageFormObj);
        }
        // this.fetchData();   
    }
    handleSubmit(e){
        e.preventDefault();
        this.toggle();
        this.fetchData();
    }
    chatWith(e, task){
        e.preventDefault();
        let typeCurrent;
        let typeOther;
        if (this.props.user.user.userType === "Employer"){
            typeCurrent = "Employer";
            typeOther = "Freelancer";
        }else{
            typeCurrent = "Freelancer";
            typeOther = "Employer";
        }

        const currentUser = {
            id: this.props.user.user.id,
            name: this.props.user.user.name,
            role: typeCurrent
        };
        let otherUser;
        if (this.props.user.user.userType === "Employer"){
            otherUser = {
                id: task.claimedBy,
                name: task.claimedName,
                role: typeOther
            }
        }else{
            otherUser = {
                id: task.postedBy,
                name: task.postedName,
                role: typeOther
            }
        }
        console.log("Current User:");
        console.log(currentUser);
        console.log("Other User:");
        console.log(otherUser);
        Talk.ready
        .then(() => {
            const me = new Talk.User(otherUser);
            const other = new Talk.User(currentUser)

            if (!window.talkSession) {
                window.talkSession = new Talk.Session({
                    appId: "tjfIxoPw",
                    me: me
                });
            } 

            const conversationId = Talk.oneOnOneId(me, other);
            const conversation = window.talkSession.getOrCreateConversation(conversationId);
            
            conversation.setParticipant(me);
            conversation.setParticipant(other);

            this.chatbox = window.talkSession.createChatbox(conversation);
            this.chatbox.mount(this.container);
        })            
        .catch(e => console.error(e));
    }
    confirm(e, task){
        e.preventDefault();
        const updTask = {
            status: "Confirmed",
            claimedBy: task.claimedBy,
            claimedName: task.claimedName,
            claimedSecret: task.claimedSecret,
            postedSecret: task.postedSecret,
            address: task.address,
            value: task.value,
        }
        this.props.updateTask(updTask);

        this.props.getUser(task.claimedBy)
            .then(res => {
                if(!res){
                    throw new Error("Server Error");
                }
                const otherUser = {
                    id: task.claimedBy,
                    isUpdateFinancial: true,
                    amount: res.balance + task.value, 
                }
                this.props.updateUser(otherUser);        
            })
        
        const thisUser = {
            id: this.props.user.user.id,
            isUpdateFinancial: true,
            amount: this.state.balance - task.value, 
        }
        this.props.updateUser(thisUser);
        this.fetchData();
    }
    markAsCompleted(e, task){
        e.preventDefault();
        const updTask = {
            status: "Completed",
            claimedBy: task.claimedBy,
            claimedName: task.claimedName,
            claimedPublic: task.claimedPublic,
            postedSecret: task.postedSecret,
            address: task.address,
        }
        this.props.updateTask(updTask);
        this.fetchData();
    }
    showFinancial(e){
        e.preventDefault();
        this.setState({ showFinancial: !this.state.showFinancial });
    }
    getOtherUser(e, task){
        e.preventDefault();
        this.props.getUser(task.claimedBy)
            .then(res => {
                if(!res){
                    throw new Error("Server Error");
                }
                this.setState({
                    otherUser: res,
                })
            })
    }
    render(){   
        let editModeF = (
            <Card style={{ borderRadius: 15, backgroundColor: '#faf9f7', borderColor: "#faf9f7" }} className = "description">
                <CardBody>
                    <CardTitle tag="h4"><strong>Personal Information</strong></CardTitle>
                    <br/>
                    <CardSubtitle tag="h6"><Icon icon={emailSolid} className="pr-2" style={{ color: "#10aa50", fontSize: "30px" }}/>{this.state.email}</CardSubtitle>
                    <br/>
                    <CardSubtitle tag="h6"><Icon icon={briefcaseIcon} className="pr-2" style={{ color: "#10aa50",fontSize: "30px" }}/>{this.state.role}</CardSubtitle>
                    <br/>
                    <CardText><Icon icon={addressBook} className="pr-2" style={{ color: "#10aa50", fontSize: "30px" }}/>{this.state.bio}</CardText>
                    <Button className="buttonEdit" onClick={this.onClick} block>Edit</Button>
                </CardBody>
            </Card>
        )
        let editModeT = (
            <Card style={{ borderRadius: 15, backgroundColor: '#faf9f7' }} className = "description">
                <CardBody>
                    <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Email</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name="email" id="email" placeholder={this.state.email} onChange={this.onChange}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Role</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name="role" id="role" placeholder={this.state.role} onChange={this.onChange}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>Bio</InputGroupText>
                        </InputGroupAddon>
                        <Input className="h-100" type="textarea" name="description" id="description" placeholder={this.state.bio} onChange={this.onChange}/>
                    </InputGroup>
                    <Row>
                        <Col className="pl-3 pr-2 mb-0">
                            <Button onClick={this.onClick} block>Cancel</Button>
                        </Col>
                        <Col className="pr-3 pl-2 mb-0">
                            <Button onClick={this.saveEdit} block>Save</Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
        return(
            <div>
                <div style={{backgroundColor: "#f1ece6"}} className="pb-4">
                    <NavBar/>
                    <div style={{ width: "50%", margin: "auto" }} className="mt-4">
                        <Card style={{ borderRadius: 15, backgroundColor: '#faf9f7' }} className = "profileCard mb-4">
                            <CardGroup>
                                <Card style={{ borderRadius: 15, backgroundColor: '#faf9f7', borderColor: "#faf9f7" }} className = "profile">
                                    {this.state.image != null ? (
                                        <div className="d-flex my-3">
                                            <i className="m-auto text-center">
                                                <Image src= {require(`/Users/winston/Documents/Programming/WebDevelopment/ADREstate/uploads/${this.state.image}`)} className="profilePicture mb-4" alt="Fail" onClick={this.openModal} roundedCircle/>
                                                <h3><strong>{this.state.name}</strong></h3>
                                            </i>
                                        </div>
                                    ) : (
                                        <div className="d-flex my-3">
                                            <i className="m-auto text-center">
                                                <Icon icon={personCircle} style={{ fontSize: "300px", color: "#10aa50" }} className="mb-4" onClick={this.openModal} />
                                                <h3><strong>{this.state.name}</strong></h3>
                                            </i>
                                        </div>
                                    )}
                                </Card>
                            </CardGroup>
                        </Card>
                        <br/>
                        <Row className="mb-2 mx-0">
                            <Col md="5" className="m-0">
                                {this.state.editMode ? editModeT : editModeF}
                                <Card style={{ borderRadius: 15, backgroundColor: '#faf9f7', borderColor: "#faf9f7" }} className = "description mt-5">
                                    <CardBody>
                                        <CardTitle tag="h4"><strong>Financial Information</strong></CardTitle>
                                        <br/>
                                        {this.state.showFinancial ? (
                                            <div>
                                                <CardSubtitle tag="h6"><Icon icon={keyFill} className="pr-2" style={{ color: "#10aa50", fontSize: "30px" }}/>Public Key: {this.state.publicKey}</CardSubtitle>
                                                <br/>
                                                <CardSubtitle tag="h6"><Icon icon={briefcaseIcon} className="pr-2" style={{ color: "#10aa50",fontSize: "30px" }}/>Secret Key: {this.state.secretKey}</CardSubtitle>
                                                <br/>
                                                <CardText><Icon icon={piggyBank} className="pr-2" style={{ color: "#10aa50", fontSize: "30px" }}/>Balance: {this.state.balance}</CardText>
                                                <br/>
                                                <Button onClick={this.showFinancial} block>Hide Financials</Button>
                                            </div>
                                        ): (
                                            <div>
                                                <Button onClick={this.showFinancial} block>Show Financials</Button>
                                            </div>
                                            
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="7">
                                <Card style={{ borderRadius: 15, backgroundColor: '#faf9f7' }} className = "mb-4 pt-2">
                                    <CardBody>
                                        <CardTitle tag="h4"><strong>Tasks: {this.state.tasks.length}</strong></CardTitle>
                                    </CardBody>
                                </Card>
                                {this.state.tasks.map((task, idx) =>
                                    <Card style={{ borderRadius: 15, backgroundColor: '#faf9f7' }} className = "mb-4">
                                        <CardBody>
                                            <CardTitle tag="h4"><strong>{task.address}</strong></CardTitle>
                                            <CardSubtitle className="subtitleTask">
                                                Posted by: {task.postedName}
                                                <span className="postedDate">Posted on: {task.date}</span>
                                                <br/>
                                            </CardSubtitle>
                                            <br/>
                                            <Row>
                                                <Col className="ml-auto text-center"><i className="m-auto"><Icon icon={moneyDollarCircleFill} className="taskIcon"/></i>
                                                    <p>Reward: ${task.value}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="text-center">
                                                    <hr style={{"width": "20%", borderTop: "1px solid #f5b142"}} className="my-4"/>
                                                    <p className="mx-2">{task.description}</p>
                                                </Col>
                                            </Row>
                                            {this.props.user.user.userType === "Employer" ? (
                                                <Row>
                                                    <Col className="text-center">
                                                        <hr style={{"width": "80%", borderTop: "1px solid #f5b142"}} className="my-4"/>
                                                        {task.status === "Not Claimed" ? (
                                                            <p>Not Claimed Yet</p>
                                                        ): (null)}
                                                        {task.status === "Claimed" ? (
                                                            <div>
                                                                <p>Claimed By: {task.claimedName}</p>
                                                                <Button className="mt-4 px-4" value={task} onClick={(e) => this.chatWith(e, task)} block>Message Freelancer</Button>
                                                            </div>
                                                        ): (null)}
                                                        {task.status === "Completed" ? (
                                                            <div>
                                                                <p>Completed (Not Confirmed) By: {task.claimedName}</p>
                                                                <Row className="mt-4">
                                                                    <Col className="pl-3 pr-2 mb-0">
                                                                        <Button value={task} onClick={(e) => {this.getOtherUser(e, task); this.confirm(e, task)}} block>Confirm Completion and Pay</Button>
                                                                    </Col>
                                                                    <Col className="pr-3 pl-2 mb-0">
                                                                        <Button value={task} onClick={(e) => this.chatWith(e, task)} block>Message Freelancer</Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        ): (null)}
                                                        {task.status === "Confirmed" ? (
                                                            <div>
                                                                <p>Completed By: {task.claimedName}</p>
                                                                <Button className="mt-4 px-4" value={task} onClick={(e) => this.chatWith(e, task)} block>Message Freelancer</Button>
                                                            </div>
                                                        ): (null)}
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <Row>
                                                    <Col className="text-center">
                                                        <hr style={{"width": "80%", borderTop: "1px solid #f5b142"}} className="my-4"/>
                                                        {task.status === "Claimed" ? (
                                                            <div>
                                                                <p>You have claimed this task</p>
                                                                <Row className="mt-4">
                                                                    <Col className="pl-3 pr-2 mb-0">
                                                                        <Button value={task} onClick={(e) => this.markAsCompleted(e, task)} block>Mark As Complete</Button>
                                                                    </Col>
                                                                    <Col className="pr-3 pl-2 mb-0">
                                                                        <Button value={task} onClick={(e) => this.chatWith(e, task)} block>Message Employer</Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        ): (null)}
                                                        {task.status === "Completed" ? (
                                                            <div>
                                                                <p>Has not been confirmed yet</p>
                                                                <Button className="mt-4 px-4" value={task} onClick={(e) => this.chatWith(e, task)} block>Message Employer</Button>
                                                            </div>
                                                        ): (null)}
                                                        {task.status === "Confirmed" ? (
                                                            <div>
                                                                <p>Completed!</p>
                                                                <Button className="mt-4 px-4" value={task} onClick={(e) => this.chatWith(e, task)} block>Message Employer</Button>
                                                            </div>
                                                        ): (null)}
                                                    </Col>
                                                </Row>
                                            )}
                                        </CardBody>
                                    </Card>
                                )}
                            </Col>
                        </Row>
                    </div>
                </div>
                <Modal className="registerModal" isOpen={this.state.modalOpen} toggle={this.toggle}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <div className="my-4 text-center">
                                <h4>Upload Profile Picture</h4>
                            </div>
                            <hr/>
                            <InputGroup className="mb-4">
                                <Input className="ml-7" type="file" multiple="multiple" id="image" name="image" value="" onChange={this.uploadImage} required/>
                            </InputGroup>
                            <Row>
                                    <Col className="pl-3 pr-2 mb-0">
                                        <Button onClick={this.toggle} block>Cancel</Button>
                                    </Col>
                                    <Col className="pr-3 pl-2 mb-0">
                                        <Button onClick={this.handleSubmit} block>Submit</Button>
                                    </Col>
                                </Row>
                        </FormGroup>
                    </Form>
                </Modal>
                <div className="chatbox-container" ref={c => this.container = c}>
                    <div id="talkjs-container" style={{height: "300px"}}><i></i></div>
                </div>
                <Footer/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    user: state.auth.user
});

export default connect(mapStateToProps, { getUser, updateUser, getTasksInd, updateTask, uploadImage, getImage, clearErrors })(Profile);