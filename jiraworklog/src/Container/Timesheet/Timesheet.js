import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Table } from 'react-bootstrap';
import User from '../../Component/User/User';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import 'bootstrap/dist/css/bootstrap.css';
import { Search, Grid, Header, Segment,Button } from 'semantic-ui-react'
import _ from 'lodash';
import Api from '../../utility';
const moment = require('moment');
const initialState = { isLoading: false, results: [], value: '' }
let date = new Date();

class Timesheet extends Component {

    state = {
        user: [],
        date: [new Date(date.getFullYear(), date.getMonth(), 1), new Date(date.getFullYear(), date.getMonth() + 1, 0)],
        isLoading: false,
        results: [],
        value: ''
    }
    componentDidUpdate(props, PrevState) {
        const [cstart, cend] = this.state.date;
        const [pstart, pend] = PrevState.date;
        if (cstart.toLocaleDateString() !== pstart.toLocaleDateString() || cend.toLocaleDateString() !== pend.toLocaleDateString()) {
            this.setFiltedData(this.state.user);
        }

    }

    getWLDatesArray = () => {
        let dateArray = this.getDateArray(new Date(this.state.date[0]), new Date(this.state.date[1]));
        let worklogArray = [];
        console.log('dateArray', dateArray);
        dateArray.map(i => worklogArray.push(i.toLocaleDateString()));
        return worklogArray;
    }

    setFiltedData = (users) => {
        console.table('single uuuuuseeeers', users);
        // const AllUsers = JSON.parse(JSON.stringify(users));
        const WLDates = this.getWLDatesArray();
        console.log('WLDates', WLDates);
        users.map((user, index) => {
            console.table('single user', user);
            users[index].worklogsData = [];
            users[index].commentArray=[];
            WLDates.forEach((date) => {
                if (user.worklog.length) {
                    console.log('single worklog user found');
                    const wl = user.worklog.find(w => new Date(w.created).toLocaleDateString() === date);
                    if (wl) {
                        users[index].commentArray.push(wl.comment.content[0].content[0].text);
                        users[index].worklogsData.push(wl.timeSpentSeconds / 3600);
                    } else {
                        users[index].commentArray.push('');
                        users[index].worklogsData.push(0);
                    }
                } else {
                    users[index].commentArray.push('');
                    users[index].worklogsData.push(0);
                }
            })
        })
        this.setState({ user: users })
        this.setState({ allRecords: users })
    }

    componentDidMount() {
        let api = localStorage.getItem('api');
        let url = localStorage.getItem('url');
        let email = localStorage.getItem('email');

        let arr = [], totalIssues, issueKeys = [], projectKey;


        Api.apicall(`${url}/rest/api/2/project`)
            .then(res => {
                projectKey = res[0].key
                console.log('it is 1st api which gives all project keys', projectKey)
            }).then(() => {
                Api.apicall(`${url}/rest/api/2/user/assignable/search?project=${projectKey}`)
                    .then(res => {
                        for (let key in res) {
                            arr.push({
                                id: res[key].accountId,
                                avatarUrls: Object.values(res[key].avatarUrls)[3],
                                name: res[key].displayName,
                                worklog: [],
                                worklogsData: [],
                                commentArray:[]
                                // datea:this.state.dateArray
                            });

                        }
                        console.log("response", res);
                        console.log("user array", arr)
                        this.setState({ user: arr })
                        console.log("state", this.state.user);

                    }).then(() => {
                        Api.apicall(`${url}/rest/api/2/search?jql=project=${projectKey}&fields=issue,name&startAt=0&maxResults=8000 `)
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
                                let counter = 0;
                                issueKeys.map((i, index) => {

                                    Api.apicall(`${url}/rest/api/3/issue/${i}/worklog`)

                                        .then(res => {
                                            for (let log in res.worklogs) {
                                                res.worklogs.map(i => {
                                                    const userIndex = arr.findIndex(u => u.id === i.author.key)
                                                    if (userIndex !== -1) {

                                                        arr[userIndex].worklog.push(i);

                                                    }
                                                })
                                            }
                                            counter++;
                                            if (issueKeys.length === counter) {
                                                console.log('arrrrrhere', arr);
                                                this.setFiltedData(arr);
                                            }
                                            console.log('updated arrayyyyyyyyyyyyy', arr);
                                            console.log('its api call for iterating all issues', res)
                                        })
                                })
                            });
                    });
            });

    }
    
    handleResultSelect = (e, { result }) => {
        console.log('single res', result);
        this.setState({ value: result.name })
    }

    handleSearchChange = (e, { value }) => {
        if (!value) {
            this.setState({ user: this.state.allRecords, value: '' })
            return;
        }

        this.setState({ isLoading: true, value })

        setTimeout(() => {
            let completeData = this.state.user;
            let a = this.state.user;
            if (this.state.value.length < 1) return this.setState({ user: a })
            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (data) => re.test(data.name)
            const users = completeData.map(i => {
                return { ...i, title: i.name, image: i.avatarUrls };
            })
            this.setState({
                isLoading: false,
                results: _.filter(users, isMatch),
            })
            this.setState({ user: this.state.results })
            console.log('results -- ', _.filter(completeData, isMatch));
        }, 300)


    }


    getDateArray = (start, end) => {
        var dateArray = new Array();
        var currentDate = start;
        while (currentDate <= end) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    handleDate = (date) => {
        console.log('new date =', date);
        this.setState({ date: date })
    }

    gotoLoginPage=()=>{
        localStorage.clear();
        this.props.history.push('/');
    }
    
    render() {
        console.log("inside renderrrrrrr", this.state.user);
        let user;
        console.log('date stateeeeeeeeeeeeee', this.state.date);
        // const datesArr = JSON.parse(JSON.stringify(this.state.date))
        let dateArr = this.getDateArray(new Date(this.state.date[0]), new Date(this.state.date[1]));

        console.log('dateArrrrrrrrrrrrrrrrrrrrrrrrrrrr', dateArr)
        const { isLoading, value, results } = this.state

        let renderData = this.state.user;

        return (
            <>
                <Button  color='teal' style={{float:'right',margin:'10px 10px 0px 0px'}} onClick={this.gotoLoginPage}>Logout</Button>

                <DateRangePicker 
                    onChange={this.handleDate}
                    value={this.state.date}
                    format="y-MM-dd"
                />

                <Grid style={{ display: 'inline' }}>
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
                        
                    </Grid.Column>
                </Grid>
                
                <Table responsive>
                    <thead>
                        <tr>
                            <th style={{ width: '22px' }}>Users</th>
                            <th> </th>
                            {
                                dateArr.map(i => <th key={i}>{moment(i).format(' D ddd')}</th>)
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {
                            user = renderData.map(param =>
                                <User
                                    key={param.id}
                                    name={param.name}
                                    avatarUrls={param.avatarUrls}
                                    time={param.worklogsData}
                                />
                            )}



                    </tbody>
                </Table>

            </>
        );
    }



}

export default withRouter(Timesheet);