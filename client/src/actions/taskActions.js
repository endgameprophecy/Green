import axios from 'axios';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const registerTask = function(task) {
    return async function (dispatch, getState) {
        return await axios.post('/api/task', task, tokenConfig(getState))
            .then(res => res.data)
            .catch(function(err) {
                console.log("Error Register Task Actions");
                console.log(err.response);
                dispatch(returnErrors(err.response.data, err.response.status));
            });
    }
}

export const getTasks = function ({userId, type}) {
    return async function (dispatch, getState) {
        const config = tokenConfig(getState);
        config["params"] = {
            userId: userId,
            type: type
        };
        return await axios.get('/api/task', config)
            .then(res => res.data)
            .catch(function(err) {
                dispatch(returnErrors(err.response.data, err.response.status));
            });
    }
}

export const getTasksInd = function ({userId, type}) {
    return async function (dispatch, getState) {
        const config = tokenConfig(getState);
        config["params"] = {
            type: type
        };
        return axios.get(`/api/task/${userId}`, config)
            .then(res => res.data)
            .catch(function(err) {
                dispatch(returnErrors(err.response.data, err.response.status));
            });
    }
}

export const updateTask = function(task){
    return function (dispatch, getState) {
        return axios.put(`/api/task/${task.address}`, task, tokenConfig(getState))
            .then(res => res.data)
            .catch(function(err) {
                console.log("get err", err); 
                dispatch(returnErrors(err.response.data, err.response.status))
            });
    }
}

export const deleteTask = function(task){    
    return function (dispatch, getState) {
        return axios.delete(`/api/task/`, { data: { address: task.address }}, tokenConfig(getState))
            .then(res => res.data)
            .catch(function(err) {
                console.log("get err", err); 
                dispatch(returnErrors(err.response.data, err.response.status))
            });
    }
}