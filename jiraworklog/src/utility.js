import base64 from 'base-64';
export default {
    
    apicall:(url)=>{
        let response;
        const api = localStorage.getItem('api');
        const email = localStorage.getItem('email');
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append('Authorization', 'Basic ' + base64.encode(`${email}:${api}`));
        response=fetch(url, { method: 'GET', headers: headers })
        .then(res => res.json())
        return response;
    }
}