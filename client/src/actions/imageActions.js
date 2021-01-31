import axios from 'axios';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const uploadImage = function(imageFormObj) {
    return async function (dispatch, getState) {
        return await axios.post('/api/image', imageFormObj, tokenConfig(getState))
            .then(res => res.data)
            .catch(function(err) {
                console.log("Error Failed Upload Image");
                console.log(err.response);
                dispatch(returnErrors(err.response.data, err.response.status));
            });
    }
}

export const getImage = function ({userId, type, address}) {
    return async function (dispatch, getState) {
        console.log("Info",userId, type, address);
        const config = tokenConfig(getState);
        config["params"] = {
            userId: userId,
            type: type,
            address: address
        };
        return axios.get(`/api/image/${userId}`, config)
            .then(res => res.data)
            .catch(function(err) {
                dispatch(returnErrors(err.response.data, err.response.status));
            });
    }
}
