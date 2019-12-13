import React, { Component } from 'react';
// import {} from 'semantic-ui-react';
//  import DateRangePicker from '../../Component/DateRangePicker/DateRangePicker';
// import { DateRangePicker } from 'react-date-range';

import { Table } from 'react-bootstrap';
import User from '../../Component/User/User';
// import {DateRangePicker} from 'rsuite';
// import 'rsuite/lib/styles/index.less'; 
// or 
// import 'rsuite/dist/styles/rsuite-default.css';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import 'bootstrap/dist/css/bootstrap.css';
// import moment from "moment";
const base64 = require('base-64');
const moment = require('moment');


class Timesheet extends Component {

    state = {
        user: [],
        date: [new Date(),new Date()]
    }


    componentDidMount() {
        let api = localStorage.getItem('api');
        let url = localStorage.getItem('url');
        let email = localStorage.getItem('email');
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append('Authorization', 'Basic ' + base64.encode(`${email}:${api}`));
        let arr = [], totalIssues, issueKeys = [];
        fetch(`${url}/rest/api/2/user/assignable/search?project=REAC`, { method: 'GET', headers: headers })
            .then(res => res.json())
            .then(res => {
                for (let key in res) {
                    arr.push({
                        id: res[key].accountId,
                        avatarUrls: Object.values(res[key].avatarUrls)[3],
                        name: res[key].displayName,
                        worklog: []
                        // datea:this.state.dateArray
                    });

                }
                console.log("response", res);
                console.log("user array", arr)
                this.setState({ user: arr })
                console.log("state", this.state.user);

            }).then(() => {

                fetch(`${url}/rest/api/2/search?jql=project=REAC&fields=issue,name&startAt=0&maxResults=8000 `, { method: 'GET', headers: headers })
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
                            fetch(`${url}/rest/api/3/issue/${i}/worklog`, { method: 'GET', headers: headers })
                                .then(res => res.json())
                                .then(res => {
                                    for (let log in res.worklogs) {
                                        res.worklogs.map(i => {
                                            if (i.author.key === arr[1].id) {

                                                arr[0].worklog.push((i.timeSpentSeconds) / 3600)
                                            }
                                        })
                                    }
                                    console.log('updated arrayyyyyyyyyyyyy', arr);
                                    console.log('its api call for iterating all issues', res)
                                })
                        });
                    });
            });

    }

    getDateArray = (start, end) => {
        var dateArray = new Array();
        var currentDate = start;
        while (currentDate <= end) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        // this.setState({dateArr:dateArray});
        return dateArray;
    }

    handleDate = (date) => {
        this.setState({ date: date })
        // console.log(this.state.date[1]);

        // this.getDateArray(this.state.date[0],this.state.date[1])


    }



    render() {
        console.log("inside renderrrrrrr", this.state.user);
        let user;
        console.log('date stateeeeeeeeeeeeee', this.state.date);
        let dateArr = this.getDateArray(this.state.date[0], this.state.date[1]);

        console.log('dateArrrrrrrrrrrrrrrrrrrrrrrrrrrr', dateArr)

        return (
            <>


                <DateRangePicker
                    onChange={this.handleDate}
                    value={this.state.date}
                />

                <Table responsive>
                    <thead>
                        <tr>
                            <th style={{ width: '75px' }}>Users</th>
                            <th style={{ width: '100px' }}></th>
                            {
                                dateArr.map(i => <th key={i}>{moment(i).format(' D ddd')}</th>)
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
                                    time={param.worklog}
                                />
                            )}



                    </tbody>
                </Table>

            </>
        );
    }



}

export default Timesheet;