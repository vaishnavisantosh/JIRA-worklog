import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import User from '../../Component/User/User';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import 'bootstrap/dist/css/bootstrap.css';
import { Search, Grid, Header, Segment } from 'semantic-ui-react'
import _ from 'lodash';

// import moment from "moment";
// import {} from 'semantic-ui-react';
//  import DateRangePicker from '../../Component/DateRangePicker/DateRangePicker';
// import { DateRangePicker } from 'react-date-range';
// import {DateRangePicker} from 'rsuite';
// import 'rsuite/lib/styles/index.less'; 
// or 
// import 'rsuite/dist/styles/rsuite-default.css';


const base64 = require('base-64');
const moment = require('moment');

 const initialState = { isLoading: false, results: [], value: '' }
 var date = new Date();
 var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
 var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
class Timesheet extends Component {

    state = {
        user: [],
        date: [firstDay, lastDay],
        isLoading: false, 
        results: [],
         value: ''
    }


    componentDidMount() {
        let api = localStorage.getItem('api');
        let url = localStorage.getItem('url');
        let email = localStorage.getItem('email');
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append('Authorization', 'Basic ' + base64.encode(`${email}:${api}`));
        let arr = [], totalIssues, issueKeys = [], projectKey;

        fetch(`${url}/rest/api/2/project`, { method: 'GET', headers: headers })
            .then(res => res.json())
            .then(res => {
                projectKey = res[0].key
                console.log('it is 1st api which gives all project keys', projectKey)

            }).then(() => {

                fetch(`${url}/rest/api/2/user/assignable/search?project=${projectKey}`, { method: 'GET', headers: headers })
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

                        fetch(`${url}/rest/api/2/search?jql=project=${projectKey}&fields=issue,name&startAt=0&maxResults=8000 `, { method: 'GET', headers: headers })
                            .then(res => res.json())
                            .then(res => {
                                // totalIssues = res;
                                for (let issuekey in res.issues) {
                                    issueKeys.push(res.issues[issuekey].key);
                                }
                                // console.log('isuessssssss',totalIssues);
                                // console.log('res.issue',res.issues)
                                console.log("key arrrayy", issueKeys)
                                console.log('issuessssssssssssssssssssssss', res.issues)
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
            });

    }

   

    handleResultSelect = (e, { result }) => {
        console.log('single res', result);
        this.setState({ value: result.name })
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            let data=this.state.user;

            if (this.state.value.length < 1) return this.setState({users:data})
            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (data) => re.test(data.name)
            const users = this.state.user.map(i => {
                return {...i, title: i.name, image: i.avatarUrls};
            })
            this.setState({
                isLoading: false,
                results: _.filter(users, isMatch),
            })
            this.setState({user:this.state.results})
            console.log('results -- ', _.filter(data, isMatch));
        }, 300)
       
       
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
        console.log('new date =', date);
        this.setState({ date })
        // console.log(this.state.date[1]);

        // this.getDateArray(this.state.date[0],this.state.date[1])


    }



    render() {
        console.log("inside renderrrrrrr", this.state.user);
        let user;
        console.log('date stateeeeeeeeeeeeee', this.state.date);
        // const datesArr = JSON.parse(JSON.stringify(this.state.date))
        let dateArr = this.getDateArray(new Date(this.state.date[0]), new Date(this.state.date[1]));

        console.log('dateArrrrrrrrrrrrrrrrrrrrrrrrrrrr', dateArr)
        const { isLoading, value, results } = this.state

        return (
            <>
                 <DateRangePicker 
                    onChange={this.handleDate}
                    value={this.state.date}
                    format="y-MM-dd"
                />

                <Grid style={{display:'inline'}}>
                    <Grid.Column width={6}>
                        <Search
                            aligned='right'
                            loading={isLoading}
                            name="name"
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                leading: true,
                            })}
                            results={this.state.results}
                            value={value}
                            {...this.props}
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        {/* <Segment>
                            <Header>State</Header>
                            <pre style={{ overflowX: 'auto' }}>
                                {JSON.stringify(this.state, null, 2)}
                            </pre>
                            <Header>Options</Header>
                            <pre style={{ overflowX: 'auto' }}>
                                {JSON.stringify(this.state.user, null, 2)}
                            </pre>
                        </Segment> */}
                    </Grid.Column>
                </Grid>

               

                <Table responsive>
                    <thead>
                        <tr>
                            <th style={{ width: '22px' }}>Users</th>
                            <th > </th>
                            {
                                dateArr.map(i => <th  key={i}>{moment(i).format(' D ddd')}</th>)
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