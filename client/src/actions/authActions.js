import axios from 'axios';
import { returnErrors } from './errorActions';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from "./types";

// Login user
export const login = ({ email, password }) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password });

    axios.post('api/auth', body, config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({
                type: LOGIN_FAIL
            })
        });
}


// Logout user
export const logout = () => {
    console.log("Logout")
    return {
        type: LOGOUT_SUCCESS
    }
}

//Setup config/headers and token
export const tokenConfig = getState => {
    // Get token from local storage
    const token = getState().auth.token;

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    //If token, add to headers
    if(token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}