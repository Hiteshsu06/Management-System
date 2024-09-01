import axios from 'axios';
const apiBaseURL = 'http://127.0.0.1:3000';

export const allApi = (dataurl, data, method) => {
    const headers = {
        'Content-Type': 'application/json'
    }
    if ('post' === method) {
        return axios.post(`${apiBaseURL}/${dataurl}`, JSON.stringify(data), { headers: headers });
    }
    if ('get' === method) {
        return axios.get(`${apiBaseURL}/${dataurl}`);
    }
    if ('delete' === method) {
        return axios.delete(`${apiBaseURL}/${dataurl}`);
    }
    if ('put' === method) {
        return axios?.put(`${apiBaseURL}/${dataurl}`, data);
    }
};

export const allApiWithHeaderToken = (dataurl, data, method) => {
    let token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }
    if ('post' === method) {
        return axios.post(`${apiBaseURL}/${dataurl}`, JSON.stringify(data), { headers: headers });
    }
    if ('get' === method) {
        return axios.get(`${apiBaseURL}/${dataurl}`, { headers: headers });
    }
    if ('delete' === method) {
        return axios.delete(`${apiBaseURL}/${dataurl}`, { headers: headers });
    }
    if ('put' === method) {
        return axios?.put(`${apiBaseURL}/${dataurl}`, data, { headers: headers });
    }
};