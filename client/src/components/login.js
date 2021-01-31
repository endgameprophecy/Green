import React, { Component } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Alert,
    Input,
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { login } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

class Login extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
        }
        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if(error !== prevProps.error) {
            if(error.id === 'LOGIN_FAIL') {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        if(this.state.modal) {
            if(isAuthenticated) {
                this.toggle();
            }
        }
    }

    toggle = () => {
        // Clear errors
        this.props.clearErrors();
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    onSubmit = (e) => {
        e.preventDefault();

        const { email, password } = this.state;
        const user = {
            email,
            password
        };
        this.props.login(user);
    };

    render() {
        return(
            <div>
                <div className="Introduction">
                    <h2>Welcome</h2>
                </div>
                <div>
                    { this.state.msg ? 
                        <Alert color="danger">
                            { this.state.msg }
                        </Alert> : null }
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                                <Input type="text" name="email" id="email" placeholder="Email" className="mb-3" onChange={this.onChange}/>
                            <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" placeholder="Enter password" className="mb-3" onChange={this.onChange}/>
                                <div className="LoginSubmit">
                                    <Button outline color="secondary" block><strong>Login</strong></Button>
                                </div>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

const mapStateToProps =  state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { login, clearErrors })(Login);