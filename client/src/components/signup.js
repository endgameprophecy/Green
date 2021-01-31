import React, { Component } from "react";
import { Icon } from "@iconify/react";
import IconButton from "@material-ui/core/IconButton";
import roundBusinessCenter from "@iconify/icons-ic/round-business-center";
import personCircle from "@iconify-icons/bi/person-circle";

import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	Alert,
	FormFeedback, //added
	FormText,
	Progress,
	CardText // added
} from "reactstrap";
import { connect } from "react-redux";
import { registerUser } from "../actions/userActions";
import { clearErrors } from "../actions/errorActions";

import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { faCheckSquare, faCoffee } from "@fortawesome/fontawesome-free-solid";

library.add(fab, faCheckSquare, faCoffee);

class SignUp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "",
			email: "",
            password: "",
            publicKey: "",
            secretKey: "",
            balance: 10000,
			confirm_password: "",
			userType: "",
			msg: null,
			valid_password: null,
			invalid_password: null,
			feedback: "",
			password_strength: "",
			password_value: 0,
			active: null
		};
		this.onChange = this.onChange.bind(this);
		this.handleUserType = this.handleUserType.bind(this);
		this.toggleColor = this.toggleColor.bind(this);
	}

	componentDidUpdate(prevProps) {
		const { error, isAuthenticated } = this.props;
		if (error !== prevProps.error) {
			if (error.id === "REGISTER_FAIL") {
				this.setState({ msg: error.msg.msg });
			} else {
				this.setState({ msg: null });
			}
		}

		if (this.state.modal) {
			if (isAuthenticated) {
				this.toggle();
			}
		}
	}

	toggle = () => {
		// Clear errors
		this.props.clearErrors();
		this.setState({
			name: "",
			email: "",
            password: "",
            publicKey: "",
            secretKey: "",
            balance: 0,
			confirm_password: "", //changes
			userType: "",
			msg: null,
			valid_password: null,
			invalid_password: null,
			feedback: "",
			password_strength: "",
			password_value: 0,
			active: null
		});
	}

	toggleColor = (position) => {
		if (this.state.active === position) {
			this.setState({ active: null })
		} else {
			this.setState({ active: position })
		}
	}

	setColor = (position) => {
		if (this.state.active === position) {
			return "#10aa50";
		}
		return "black";
	}

	async handleUserType(userType, position) {
		console.log("Calling handleUserType!");
		console.log(userType);
		await this.setState({ userType: userType });
		this.toggleColor(position);
		console.log(this.state);
	}

	async onChange(e) {
		await this.setState({ [e.target.name]: e.target.value });
		if (this.state.password !== "") {
			var [strength, value] = checkPasswordStrength(this.state.password);
			await this.setState({ password_strength: strength, password_value: value });
		}
		if (this.state.confirm_password !== "") {
			if (this.state.confirm_password !== this.state.password) {
				await this.setState({ valid_password: false, invalid_password: true, feedback: "Passwords do not match" })
			}
			else {
				await this.setState({ valid_password: true, invalid_password: false, feedback: "Passwords match" })
			}
		}
		console.log(this.state);
	};

	onSubmit = (e) => {
		e.preventDefault();
		if (this.state.password === this.state.confirm_password) {
			const { name, email, password, userType, publicKey, secretKey, balance } = this.state;

			const newUser = {
				name,
				email,
				password,
                userType,
                publicKey: publicKey,
                secretKey: secretKey,
                balance: balance,
			};
            console.log("Signup", newUser);

			this.props.registerUser(newUser);
			console.log("End of Handle Submit");
		}
	};

	render() {
		return (
			<div class="register-link">
				{ this.state.msg ?
					<Alert color="danger">
						{this.state.msg}
					</Alert> : null}
				<Form onSubmit={this.onSubmit}>
					<FormGroup>
						<div className="UserType">
							<div style={{ width: "50%" }}>
								<div class="d-flex"><i class="m-auto"><IconButton style={{ color: this.setColor(0) }} onClick={() => { this.handleUserType("Freelancer", 0) }}><Icon value="Freelancer" icon={personCircle} className="UserIcon" /></IconButton></i></div>
								<CardText className="text-center">Freelancer</CardText>
							</div>
							<div style={{ width: "50%" }}>
								<div class="d-flex"><i class="m-auto"><IconButton style={{ color: this.setColor(1) }} onClick={() => { this.handleUserType("Employer", 1) }}><Icon value="Employer" icon={roundBusinessCenter} className="UserIcon" /></IconButton></i></div>
								<CardText className="text-center">Employer</CardText>
							</div>
						</div>
						<FormText> {this.state.user_type_feedback} </FormText>
						<Label for="name">Name</Label>
						<Input type="text" name="name" id="name" placeholder="Name" className="mb-3" onChange={this.onChange} />
						<Label for="email">Email</Label>
						<Input type="text" name="email" id="email" placeholder="Email" className="mb-3" onChange={this.onChange} />
                        <Label for="publicKey">Public Key</Label>
						<Input type="text" name="publicKey" id="publicKey" placeholder="Public Key" className="mb-3" onChange={this.onChange} />
                        <Label for="secretKey">Secret Key</Label>
						<Input type="text" name="secretKey" id="secretKey" placeholder="Secret Key" className="mb-3" onChange={this.onChange} />
						<Label for="password">Password</Label>
						<Input type="password" name="password" id="password" placeholder="Enter password" className="mb-3" onChange={this.onChange} />
						<Label for="confirm_password">Confirm Password</Label>
						<Input type="password" name="confirm_password" id="confirm_password" placeholder="Reenter Password" className="mb-3" onChange={this.onChange} valid={this.state.valid_password === true} invalid={this.state.invalid_password === true} />
						<Progress value={this.state.password_value} color="info">{this.state.password_strength}</Progress>
						<FormFeedback valid={this.state.valid_password}>
							{this.state.feedback}
						</FormFeedback>
					</FormGroup>
					<div className="SignUpSubmit">
						<Button outline color="secondary" block><strong>Sign Up</strong></Button>
					</div>
				</Form>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error
});

function checkPasswordStrength(password) {
	var strength = 0;
	if (password.length >= 8) {
		strength += 1
	}
	if (password.match(/[a-z]+/)) {
		strength += 1;
	}
	if (password.match(/[A-Z]+/)) {
		strength += 1;
	}
	if (password.match(/[0-9]+/)) {
		strength += 1;
	}
	if (password.match(/[$@#&!]+/)) {
		strength += 1;
	}
	if (password.length === 0) {
		return ["", 0]
	}
	if (strength <= 2) {
		return ["Insecure", 25]
	}
	else if (strength === 3) {
		return ["Weak", 50]
	}
	else if (strength === 4) {
		return ["Fair", 75]
	}
	else if (strength === 5) {
		return ["Strong", 100]
	}
}

export default connect(mapStateToProps, { registerUser, clearErrors })(SignUp);
