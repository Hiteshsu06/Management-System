import axios from 'axios';

const apiBaseURL = 'https://management-system-backend-ochre.vercel.app';

export const allApi = (dataurl, data, method) => {
    if ('post' === method) {
        return axios.post(`${apiBaseURL}/${dataurl}`, data);
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
