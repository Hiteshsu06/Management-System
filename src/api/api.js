import axios from 'axios';
const apiBaseURL = 'https://management-system-backend-94z3.onrender.com';

export const allApi = (dataurl, data, method) => {
    const headers = {
        'Content-Type': 'application/json',
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

export const allApiWithHeaderToken = (dataurl, data, method, contentType) => {
    let token = localStorage.getItem('token');
    const headers = {
        'Content-Type': contentType,
        'Authorization': token
    }
    const axiosInstance = axios.create({
        baseURL: apiBaseURL,
        headers: headers,
    });
    // Handle File content
    if(contentType){
        headers['Content-Type'] = 'multipart/form-data';
        let requestData = new FormData();
        Object.keys(data).forEach((key) => {
            requestData.append(key, data[key]);
        });
        if ('post' === method) {
            return axios.post(`${apiBaseURL}/${dataurl}`, requestData, { headers: headers });
        }
        if ('put' === method) {
            return axios?.put(`${apiBaseURL}/${dataurl}`, requestData, { headers: headers });
        }
    }
   else{
        // Interceptor
        axiosInstance.interceptors.response.use(
        (response) => {
            // Return the response if successful
            return response;
        },
        (error) => {
            // If error response has a status of 401, redirect to login
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');  // Remove invalid token
                window.location.href = '/';  
            }
            return Promise.reject(error); // Reject promise if something goes wrong
        }
        );
        if ('post' === method) {
            return axiosInstance.post(`${apiBaseURL}/${dataurl}`, JSON.stringify(data), { headers: headers });
        }
        if ('get' === method) {
            return axiosInstance.get(`${apiBaseURL}/${dataurl}`, { headers: headers });
        }
        if ('delete' === method) {
            return axiosInstance.delete(`${apiBaseURL}/${dataurl}`, { headers: headers });
        }
        if ('put' === method) {
            return axiosInstance?.put(`${apiBaseURL}/${dataurl}`, data, { headers: headers });
        }
    }
};