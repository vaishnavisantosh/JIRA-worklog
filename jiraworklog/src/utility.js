import base64 from 'base-64';
import axios from 'axios';
export default {

    apicall: async (url) => {
        let response;
        const api = localStorage.getItem('apiToken');
        const email = localStorage.getItem('email');
        const headers = { Authorization: 'Basic ' + base64.encode(`${email}:${api}`), "Content-Type": 'application/json', Accept: 'application/json' };
        response = await axios.get(url, { headers });
        return response.data;
    }
}