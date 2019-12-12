import React, { Component } from 'react';
// import {} from 'semantic-ui-react';
 import DateRangePicker from '../../Component/DateRangePicker/DateRangePicker';
// import { DateRangePicker } from 'react-date-range';

import {  Table } from 'react-bootstrap';
import User from '../../Component/User/User';
// import {DateRangePicker} from 'rsuite';
// import 'rsuite/lib/styles/index.less'; 
// or 
import 'rsuite/dist/styles/rsuite-default.css';

import 'bootstrap/dist/css/bootstrap.css';
// import moment from "moment";
const base64 = require('base-64');
const moment=require('moment');

class Timesheet extends Component {

    state = {
        user: [],
        dateArray:[10,11,12,13,14,15],
         mydate : "2017-08-30T00:00:00"

        
    }
    
    
    componentDidMount() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append('Authorization', 'Basic ' + base64.encode('vaishnavi.jawanjal@cuelogic.com:76cUIpriuCh9iNmcdrWe07D4'));
        let arr = [], totalIssues, issueKeys = [];
        fetch('https://vaishnavijawanjal.atlassian.net/rest/api/2/user/assignable/search?project=REAC', { method: 'GET', headers: headers })
            .then(res => res.json())
            .then(res => {
                for (let key in res) {
                    arr.push({
                        id: res[key].accountId,
                        avatarUrls: Object.values(res[key].avatarUrls)[3],
                        name: res[key].displayName,
                        datea:this.state.dateArray
                    });

                }
                console.log("response", res);
                console.log("user array", arr)
                this.setState({ user: arr })
                console.log("state", this.state.user);

            }).then(() => {

                fetch('https://vaishnavijawanjal.atlassian.net/rest/api/2/search?jql=project=REAC&fields=issue,name&startAt=0&maxResults=8000 ', { method: 'GET', headers: headers })
                    .then(res => res.json())
                    .then(res => {
                        // totalIssues = res;
                        for (let issuekey in res.issues) {
                            issueKeys.push(res.issues[issuekey].key);
                        }
                        // console.log('isuessssssss',totalIssues);
                        // console.log('res.issue',res.issues)
                        console.log("key arrrayy", issueKeys)
                    }).then(() => {
                        issueKeys.map(i => {
                            fetch(`https://vaishnavijawanjal.atlassian.net/rest/api/3/issue/${i}/worklog`, { method: 'GET', headers: headers })
                                .then(res => res.json())
                                .then(res => {
                                    console.log('its api call for iterating all issues', res)
                                })
                        });
                    });
            });

    }

    
    render() {
        console.log("inside renderrrrrrr", this.state.user);
        let user;
        
        

        return (
            <>
            
            
                <DateRangePicker />

                <Table responsive>
                    <thead>
                        <tr>
                            <th style={{width:'75px'}}>Users</th>
                            <th style={{width:'100px'}}></th>
                            {
                                this.state.dateArray.map(i=><th key={i}>{moment(this.state.mydate).format(' D ddd')}</th>)
                            }
                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user = this.state.user.map(param =>
                                <User
                                    key={param.id}
                                    name={param.name}
                                    avatarUrls={param.avatarUrls}
                                    dateArr={param.datea}
                                     />
                            )}


                        
                    </tbody>
                </Table>

            </>
        );
    }



}

export default Timesheet;