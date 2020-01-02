import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import User from '../../Component/User/User';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { Search, Grid, Button } from 'semantic-ui-react'
import { escapeRegExp, filter, debounce } from 'lodash';
import Api from '../../utility';
import moment from 'moment';
import './Timesheet.css';

class Timesheet extends Component {
    state = {
        users: [],
        date: [moment().startOf('month').format('YYYY-MM-DD hh:mm'), moment().endOf('month').format('YYYY-MM-DD hh:mm')],
        isLoading: false,
        results: [],
        value: '',
        verticalsum: []
    }

    componentDidUpdate(props, PrevState) {
        const { users, date } = this.state;
        const [currentStateStartMonthDate, currentStateMonthEndDate] = date;
        const [prevStateStartMonthDate, prevStateMonthEndDate] = PrevState.date;
        if (currentStateStartMonthDate !== prevStateStartMonthDate || currentStateMonthEndDate !== prevStateMonthEndDate) {
            this.setFiltedData(users);
        }
    }

    getWLDatesArray = () => {
        const { date } = this.state;
        const selectedDates = this.getSelectedDateRange(new Date(date[0]), new Date(date[1]));
        const worklogs = [];
        selectedDates.map(i => worklogs.push(i.toLocaleDateString()));
        return worklogs;
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
        users.map((user) => total.push(user.worklogsData));
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
                    const worklogData = user.worklog.find(worklogDate => new Date(worklogDate.started).toLocaleDateString() === date);
                    if (worklogData) {
                        users[index].commentArray.push(worklogData.comment.content[0].content[0].text);
                        users[index].worklogsData.push((worklogData.timeSpentSeconds / 3600).toFixed(2));
                    } else {
                        users[index].commentArray.push('');
                        users[index].worklogsData.push((0).toFixed(2));
                    }
                } else {
                    users[index].commentArray.push('');
                    users[index].worklogsData.push((0).toFixed(2));
                }
            })
            return 1;
        })
        this.setState({ users: users })
        this.setState({ allRecords: users })
        this.getTotalOfWorklogs(users);

    }


    getUsersWorklogs = async () => {
        let counter = 0;
        const url = localStorage.getItem('url');
        const users = [];
        const projectKey = await Api.apicall(`${url}/rest/api/2/project`);
        const usersData = await Api.apicall(`${url}/rest/api/2/user/assignable/search?project=${projectKey[0].key}`)
        for (let key in usersData) {
            users.push({
                id: usersData[key].accountId,
                avatarUrls: Object.values(usersData[key].avatarUrls)[3],
                name: usersData[key].displayName,
                worklog: [],
                worklogsData: [],
                commentArray: []
            });
        }
        this.setState({ users: users });
        const issueKeys = await Api.apicall(`${url}/rest/api/2/search?jql=project=${[projectKey[0].key]}&fields=issue,name&startAt=0&maxResults=8000`)
        const issuekeys = [];
        for (let issue in issueKeys.issues) {
            issuekeys.push(issueKeys.issues[issue].key);
        }
        for (let key in issuekeys) {
            const response = await Api.apicall(`${url}/rest/api/3/issue/${issuekeys[key]}/worklog`)
            response.worklogs.map(i => {
                const userIndex = users.findIndex(u => u.id === i.author.key)
                if (userIndex !== -1) {
                    users[userIndex].worklog.push(i);
                }
                return 1;
            })

            counter++;
            if (issuekeys.length === counter) {
                this.setFiltedData(users);
            }
        }
    }

    componentDidMount() {
        this.getUsersWorklogs();
    }

    handleResultSelect = (e, { result }) => {
        this.setState({ value: result.name })
    }

    handleSearchChange = (e, { value }) => {
        const { allRecords } = this.state;
        if (!value) {
            this.setState({ users: allRecords, value: '' })
            return;
        }
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            const completeData = this.state.users;
            const usersData = this.state.users;
            if (this.state.value.length < 1) return this.setState({ users: usersData })
            const regularExpressionDate = new RegExp(escapeRegExp(this.state.value), 'i')
            const isMatch = (data) => regularExpressionDate.test(data.name)
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

    getSelectedDateRange = (start, end) => {
        const dateRange = [];
        let currentDate = start;
        while (currentDate <= end) {
            dateRange.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateRange;
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
        const selectedDateRange = this.getSelectedDateRange(new Date(date[0]), new Date(date[1]));
        const horizontalTotal = this.getTotalOfWorklogs(users);
        const verticalSumOfTotalhorizonalTime = horizontalTotal.length !== 0 ? horizontalTotal.reduce((a, b) => parseInt(a) + parseInt(b)) : 0

        return (
            <>
                <div style={{ height: '15px' }}></div>
                <Button color='teal' style={{ float: 'right', margin: '0px 10px 0px 0px' }} onClick={this.gotoLoginPage}>Logout</Button>

                <DateRangePicker
                    onChange={this.handleSetDate}
                    value={date}
                    format="y-MM-dd"
                    clearIcon={null}
                />

                <Grid style={{ display: 'inline' }}>
                    <Grid.Column width={4} style={{ padding: '0px 0px 0px 40px' }}>
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
                                    selectedDateRange.length ?
                                        selectedDateRange.map(i => <td key={i} style={{ fontSize: '19px', fontWeight: 'normal' }} >{moment(i).format('D ddd')}</td>) : 'no records found!'
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.length ?
                                    users.map((param, index) =>
                                        <User
                                            key={param.id}
                                            name={param.name}
                                            avatarurls={param.avatarUrls}
                                            time={param.worklogsData}
                                            comments={param.commentArray}
                                            horizontalTotal={horizontalTotal[index]}
                                            selectedDateRange={selectedDateRange}
                                        />
                                    ) : "no records Found!"}
                            <tr>
                                <td></td>
                                <td></td>
                                <td className="showRightBorder"></td>
                                {selectedDateRange.map(i => <td></td>)}
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td style={{ fontWeight: 'bold' }}>Total</td>
                                <td className='showRightBorder'>{`${verticalSumOfTotalhorizonalTime}h`}</td>
                                {
                                    verticalTotalOfWorklogs.length !== 0 ? verticalTotalOfWorklogs.map(i => <td style={{ fontWeight: 'bold' }}>{`${i.toFixed(2)}h`}</td>) : 0
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