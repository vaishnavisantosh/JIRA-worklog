import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import User from '../../Component/User/User';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { Search, Grid, Button } from 'semantic-ui-react'
import { escapeRegExp, filter, debounce } from 'lodash';
import Api from '../../utility';
import moment from 'moment';
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
        const { users } = this.state;
        const [currentStateStartMonthDate, currentStateMonthEndDate] = this.state.date;
        const [prevStateStartMonthDate, prevStateMonthEndDate] = PrevState.date;
        if (currentStateStartMonthDate.toLocaleDateString() !== prevStateStartMonthDate.toLocaleDateString() || currentStateMonthEndDate.toLocaleDateString() !== prevStateMonthEndDate.toLocaleDateString()) {
            this.setFiltedData(users);
        }

    }

    getWLDatesArray = () => {
        const { date } = this.state;
        const dateArray = this.getDateArray(new Date(date[0]), new Date(date[1]));
        const worklogArray = [];
        dateArray.map(i => worklogArray.push(i.toLocaleDateString()));
        return worklogArray;
    }

    getTotalOfWorklogs = (worklogArray) => {
        const horizontalTotal = [];
        worklogArray.forEach(i => (horizontalTotal.push((i.worklogsData.reduce((a, b) => parseInt(a) + parseInt(b), 0)).toFixed(2))))
        return horizontalTotal;
    }

    getverticalSum = (arr) => (arr.reduce((r, a) => a.map((b, i) => (parseInt(r[i]) || 0) + parseInt(b)), []))

    getverticalTotalarray = () => {
        const { users } = this.state;
        const total = [];
        users.map((user, index) => total.push(user.worklogsData));

        if (total.length !== 0)
            return this.getverticalSum(total);

        else { return []; }
    }

    setFiltedData = (users) => {
        const WLDates = this.getWLDatesArray();
        users.map((user, index) => {

            users[index].worklogsData = [];
            users[index].commentArray = [];
            WLDates.forEach((date) => {
                if (user.worklog.length) {
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
            return 1;
        })
        this.setState({ users: users })
        this.setState({ allRecords: users })
        this.getTotalOfWorklogs(users);

    }

    componentDidMount() {

        const url = localStorage.getItem('url');
        const usersArray = [], issueKeys = [];
        let projectKey;

        Api.apicall(`${url}/rest/api/2/project`)
            .then(res => {
                projectKey = res[0].key
            }).then(() => {
                Api.apicall(`${url}/rest/api/2/user/assignable/search?project=${projectKey}`)
                    .then(res => {
                        for (let key in res) {
                            usersArray.push({
                                id: res[key].accountId,
                                avatarUrls: Object.values(res[key].avatarUrls)[3],
                                name: res[key].displayName,
                                worklog: [],
                                worklogsData: [],
                                commentArray: []
                            });

                        }
                        this.setState({ users: usersArray })

                    }).then(() => {
                        Api.apicall(`${url}/rest/api/2/search?jql=project=${projectKey}&fields=issue,name&startAt=0&maxResults=8000 `)
                            .then(res => {
                                for (let issuekey in res.issues) {
                                    issueKeys.push(res.issues[issuekey].key);
                                }
                            }).then(() => {
                                let counter = 0;
                                issueKeys.map((i, index) => {

                                    Api.apicall(`${url}/rest/api/3/issue/${i}/worklog`)

                                        .then(res => {
                                            for (let log in res.worklogs) {
                                                res.worklogs.map(i => {
                                                    const userIndex = usersArray.findIndex(u => u.id === i.author.key)
                                                    if (userIndex !== -1) {

                                                        usersArray[userIndex].worklog.push(i);

                                                    }
                                                    return 1;
                                                }
                                                )
                                            }
                                            counter++;
                                            if (issueKeys.length === counter) {
                                                this.setFiltedData(usersArray);
                                            }
                                        })
                                    return 1;
                                })
                            });
                    });
            });

    }


    handleResultSelect = (e, { result }) => {
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
        }, 300)


    }


    getDateArray = (start, end) => {
        const dateArray = [];
        let currentDate = start;
        while (currentDate <= end) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    handleSetDate = (date) => {
        this.setState({ date: date })
    }

    gotoLoginPage = () => {
        localStorage.clear();
        this.props.history.push('/');
    }

    render() {

        const { users, date, isLoading, value, results } = this.state;
        const verticalTotalOfWorklogs = this.getverticalTotalarray();
        const dateArray = this.getDateArray(new Date(date[0]), new Date(date[1]));
        const horizontalTotal = this.getTotalOfWorklogs(users);
        const verticalSumOfTotalhorizonalTime = horizontalTotal.length !== 0 ? horizontalTotal.reduce((a, b) => parseInt(a) + parseInt(b)) : 0

        return (
            <>

                <Button color='teal' style={{ float: 'right', margin: '10px 10px 0px 0px' }} onClick={this.gotoLoginPage}>Logout</Button>

                <DateRangePicker
                    onChange={this.handleSetDate}
                    value={date}
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
                            results={results}
                            value={value}
                            {...this.props}
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>

                    </Grid.Column>
                </Grid>

                <div style={{ overflowX: 'auto' }}>
                    <table >
                        <thead>
                            <tr>
                                <th></th>

                                <th style={{ Width: '22px' }}>Users</th>
                                <th className='showRightBorder'> &#931;</th>
                                {
                                    dateArray.map(i => <td key={i} style={{ fontSize: '19px', fontWeight: 'normal' }} >{moment(i).format('D ddd')}</td>)
                                }

                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((param, index) =>
                                    <User
                                        key={param.id}
                                        name={param.name}
                                        avatarurls={param.avatarUrls}
                                        time={param.worklogsData}
                                        comments={param.commentArray}
                                        horizontalTotal={horizontalTotal[index]}
                                        datearray={dateArray}
                                    />
                                )}
                            <tr>
                                <td></td>
                                <td></td>
                                <td className="showRightBorder"></td>
                                {dateArray.map(i => <td></td>)}
                            </tr>
                        </tbody>

                        <tfoot>
                            <tr>
                                <td></td>
                                <td style={{ fontWeight: 'bold' }}>Total</td>

                                <td className='showRightBorder'>{`${verticalSumOfTotalhorizonalTime}h`}</td>
                                {
                                    verticalTotalOfWorklogs.length !== 0 ?
                                        verticalTotalOfWorklogs.map(i => <td style={{ fontWeight: 'bold' }}>{`${i.toFixed(2)}h`}</td>) : 0
                                }

                            </tr>

                        </tfoot>

                    </table>
                </div>

            </>
        );
    }



}

export default withRouter(Timesheet);