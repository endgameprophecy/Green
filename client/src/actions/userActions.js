import axios from 'axios';
import { tokenConfig } from './authActions';
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

export const registerUser = function (user) {
    console.log("User (Actions)", user)
    return function (dispatch, getState) {
        return axios.post('/api/user', user, tokenConfig(getState))
            .then(res => dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            }))
            .catch(function(err) {
                dispatch(returnErrors(err.response.data, err.response.status));
            });
    }
};

export const getUser = function (userId) {
    return function (dispatch, getState) {
        return axios.get(`/api/user/${userId}`, tokenConfig(getState))
            .then(res => res.data)
            .catch(function(err) {
                dispatch(returnErrors(err.response.data, err.response.status))
            });
    }
};

export const updateUser = function(user){
    return function (dispatch, getState) {
        return axios.put(`/api/user/${user.id}`, user, tokenConfig(getState))
            .then(res => res.data)
            .catch(function(err) {
                console.log("get err", err); 
                dispatch(returnErrors(err.response.data, err.response.status))
            });
    }
}