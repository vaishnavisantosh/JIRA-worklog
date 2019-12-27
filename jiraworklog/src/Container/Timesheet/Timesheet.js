import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import User from '../../Component/User/User';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { Search, Grid, Button } from 'semantic-ui-react'
import { escapeRegExp, filter, debounce } from 'lodash';
import Api from '../../utility';
import moment from 'moment';
import ErrorBoundry from '../../Hoc/ErrorBoundry/ErrorBoundry';
import './Timesheet.css';
let date = new Date();

class Timesheet extends Component {

    state = {
        users: [],
        date: [new Date(date.getFullYear(), date.getMonth(), 1), new Date(date.getFullYear(), date.getMonth() + 1, 0)],
        isLoading: false,
        results: [],
        value: '',
        verticalsum: []
    }
    componentDidUpdate(props, PrevState) {
        const [cstart, cend] = this.state.date;
        const [pstart, pend] = PrevState.date;
        if (cstart.toLocaleDateString() !== pstart.toLocaleDateString() || cend.toLocaleDateString() !== pend.toLocaleDateString()) {
            this.setFiltedData(this.state.users);
        }

    }

    getWLDatesArray = () => {
        const dateArray = this.getDateArray(new Date(this.state.date[0]), new Date(this.state.date[1]));
        const worklogArray = [];
        console.log('dateArray', dateArray);
        dateArray.map(i => worklogArray.push(i.toLocaleDateString()));
        return worklogArray;
    }

    getTotal = (worklogArray) => {
        const horizontalTotal = [];
        console.log('inside getTotal worklogArray', worklogArray);
        worklogArray.map(i => (horizontalTotal.push((i.worklogsData.reduce((a, b) => parseInt(a) + parseInt(b), 0)).toFixed(2))))
        return horizontalTotal;
    }

    getverticalSum = (arr) => ( arr.reduce((r, a) => a.map((b, i) => (parseInt(r[i]) || 0) + parseInt(b)), [])
        // console.log('verticalllllllllll sm', verticaltotal);

        )

    getverticalTotalarray = () => {
       const {users}=this.state;
        const total = [];
        
        users.map((user, index) => total.push(user.worklogsData));
        console.log('totallllllllllllllllll vvvvvvvvv', total);
        if (total.length !== 0)
            return  this.getverticalSum(total);

        else { return []; }


    }
    setFiltedData = (users) => {
        console.table('single uuuuuseeeers', users);
        const WLDates = this.getWLDatesArray();
        console.log('WLDates', WLDates);
        users.map((user, index) => {
            console.table('single user', user);
            users[index].worklogsData = [];
            users[index].commentArray = [];
            WLDates.forEach((date) => {
                if (user.worklog.length) {
                    console.log('single worklog user found');
                    const wl = user.worklog.find(w => new Date(w.started).toLocaleDateString() === date);
                    if (wl) {
                        users[index].commentArray.push(wl.comment.content[0].content[0].text);
                        users[index].worklogsData.push((wl.timeSpentSeconds / 3600).toFixed(2));
                    } else {
                        users[index].commentArray.push('');
                        users[index].worklogsData.push((0).toFixed(2));
                    }
                } else {
                    users[index].commentArray.push('');
                    users[index].worklogsData.push((0).toFixed(2));
                }
            }

            )
        })
        this.setState({ users: users })
        this.setState({ allRecords: users })
        console.log('users 12345', users);
        this.getTotal(users);

    }

    componentDidMount() {

        const url = localStorage.getItem('url');
        const arr = [], issueKeys = [];
        let projectKey;

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
                                commentArray: []
                            });

                        }
                        console.log("response", res);
                        console.log("user array", arr)
                        this.setState({ users: arr })
                        console.log("state", this.state.users);

                    }).then(() => {
                        Api.apicall(`${url}/rest/api/2/search?jql=project=${projectKey}&fields=issue,name&startAt=0&maxResults=8000 `)
                            .then(res => {
                                for (let issuekey in res.issues) {
                                    issueKeys.push(res.issues[issuekey].key);
                                }
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
            this.setState({ users: this.state.allRecords, value: '' })
            return;
        }
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            const completeData = this.state.users;
            const a = this.state.users;
            if (this.state.value.length < 1) return this.setState({ users: a })
            const re = new RegExp(escapeRegExp(this.state.value), 'i')
            const isMatch = (data) => re.test(data.name)
            const users = completeData.map(i => {
                return { ...i, title: i.name, image: i.avatarUrls };
            })
            this.setState({
                isLoading: false,
                results: filter(users, isMatch),
            })
            this.setState({ users: this.state.results })
            console.log('results -- ', filter(completeData, isMatch));
        }, 300)


    }


    getDateArray = (start, end) => {
        var dateArray = [];
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

    gotoLoginPage = () => {
        localStorage.clear();
        this.props.history.push('/');
    }

    render() {
        let varr;
        varr = this.getverticalTotalarray();
        console.log('varrrrr', varr)
        console.log("inside renderrrrrrr", this.state.users);

        console.log('date stateeeeeeeeeeeeee', this.state.date);
        let dateArr = this.getDateArray(new Date(this.state.date[0]), new Date(this.state.date[1]));

        console.log('dateArrrrrrrrrrrrrrrrrrrrrrrrrrrr', dateArr)
        const { isLoading, value } = this.state

        let renderData = this.state.users;
        let horizontalTotal = this.getTotal(renderData);
        console.log('horizontal totallllllllllllllllllll', horizontalTotal);
        let verticalSumOfTotalhorizonalTime = horizontalTotal.length !== 0 ? horizontalTotal.reduce((a, b) => parseInt(a) + parseInt(b)) : 0
        console.log('complete horizontal', verticalSumOfTotalhorizonalTime)

        return (
            <>
              <ErrorBoundry>
                <Button color='teal' style={{ float: 'right', margin: '10px 10px 0px 0px' }} onClick={this.gotoLoginPage}>Logout</Button>

                <DateRangePicker
                    onChange={this.handleDate}
                    value={this.state.date}
                    format="y-MM-dd"
                    clearIcon={null}
                />



                <Grid style={{ display: 'inline' }}>
                    <Grid.Column width={4} style={{ padding: '0px 0px 0px 20px' }}>
                        <Search style={{ width: '100%' }}
                            aligned='right'
                            loading={isLoading}
                            name="name"
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={debounce(this.handleSearchChange, 500, {
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
              
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '22px' }}>Users</th>
                                    <th></th>
                                    <th className='showRightBorder'> &#931;</th>
                                    {
                                        dateArr.map(i => <td key={i} style={{ fontSize: '19px', fontWeight: 'normal' }} >{moment(i).format('D ddd')}</td>)
                                    }

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    renderData.map((param, index) =>
                                        <User
                                            key={param.id}
                                            name={param.name}
                                            avatarurls={param.avatarUrls}
                                            time={param.worklogsData}
                                            comments={param.commentArray}
                                            horizontalTotal={horizontalTotal[index]}
                                            datearray={dateArr}
                                        />
                                    )}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className="showRightBorder"></td>
                                    {dateArr.map(i => <td></td>)}
                                </tr>
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td style={{ fontWeight: 'bold' }}>Total</td>

                                    <td className='showRightBorder'>{`${verticalSumOfTotalhorizonalTime}h`}</td>
                                    {
                                        varr.length !== 0 ?
                                            varr.map(i => <td style={{ fontWeight: 'bold' }}>{`${i.toFixed(2)}h`}</td>) : 0
                                    }

                                </tr>

                            </tfoot>

                        </table>
                    </div>
                </ErrorBoundry>
            </>
        );
    }



}

export default withRouter(Timesheet);