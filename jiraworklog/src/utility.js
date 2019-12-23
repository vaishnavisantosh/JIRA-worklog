const base64 = require('base-64');

export default {

    
    apicall:(url)=>{
        let response;
        let api = localStorage.getItem('api');
        // let url = localStorage.getItem('url');
        let email = localStorage.getItem('email');
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append('Authorization', 'Basic ' + base64.encode(`${email}:${api}`));
       response=fetch(url, { method: 'GET', headers: headers })
        .then(res => res.json())

        return response;
    }
}