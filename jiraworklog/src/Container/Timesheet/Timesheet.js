import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { Table } from 'react-bootstrap';
import User from '../../Component/User/User';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import 'bootstrap/dist/css/bootstrap.css';
import { Search, Grid,Button } from 'semantic-ui-react'
import _ from 'lodash';
import Api from '../../utility';
const moment = require('moment');
let date = new Date();

class Timesheet extends Component {

    state = {
        user: [],
        date: [new Date(date.getFullYear(), date.getMonth(), 1), new Date(date.getFullYear(), date.getMonth() + 1, 0)],
        isLoading: false,
        results: [],
        value: '',
        verticalsum:[]
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

    getTotal=(worklogArray)=>{
        let horizontalTotal=[];
        console.log('inside getTotal worklogArray',worklogArray);
        worklogArray.map(i=>(horizontalTotal.push((i.worklogsData.reduce((a,b) => parseInt(a)+parseInt(b),0)).toFixed(2))))

        //console.log('horizontal total',horizontalTotal);
        return horizontalTotal;
    }

    getverticalSum=(arr)=>{
        let verticaltotal;
        
        verticaltotal=arr.reduce((r, a) => a.map((b, i) => (parseInt( r[i]) || 0) +parseInt(b)), []);
                console.log('verticalllllllllll sm',verticaltotal);

                return verticaltotal;

    }

    getverticalTotalarray=() => {
        let total=[];
        let verticaltotal;
       this.state.user.map((user,index)=>total.push(user.worklogsData));
       console.log('totallllllllllllllllll vvvvvvvvv',total);
        if(total.length!=0)
       return verticaltotal= this.getverticalSum(total);

        else{return [];}
        

    }
    setFiltedData = (users) => {
        console.table('single uuuuuseeeers', users);
        const WLDates = this.getWLDatesArray();
        console.log('WLDates', WLDates);
        users.map((user, index) => {
            console.table('single user', user);
            users[index].worklogsData = [];
            users[index].commentArray=[];
            WLDates.forEach((date) => {
                if (user.worklog.length) {
                    console.log('single worklog user found');
                    const wl = user.worklog.find(w => new Date(w.started).toLocaleDateString() === date);
                    if (wl) {
                        users[index].commentArray.push(wl.comment.content[0].content[0].text);
                        users[index].worklogsData.push(( wl.timeSpentSeconds / 3600).toFixed(2));
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
        this.setState({ user: users })
        this.setState({ allRecords: users })
        console.log('users 12345',users);
         this.getTotal(users);

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
                            });

                        }
                        console.log("response", res);
                        console.log("user array", arr)
                        this.setState({ user: arr })
                        console.log("state", this.state.user);

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
        let varr;
       varr= this.getverticalTotalarray();
       console.log('varrrrr',varr)
        console.log("inside renderrrrrrr", this.state.user);
        let user;
        console.log('date stateeeeeeeeeeeeee', this.state.date);
        let dateArr = this.getDateArray(new Date(this.state.date[0]), new Date(this.state.date[1]));

        console.log('dateArrrrrrrrrrrrrrrrrrrrrrrrrrrr', dateArr)
        const { isLoading, value, results } = this.state

        let renderData = this.state.user;
        let horizontalTotal=this.getTotal(renderData);
        console.log('horizontal totallllllllllllllllllll',horizontalTotal);
        let verticalSumOfTotalhorizonalTime=horizontalTotal.length!=0? horizontalTotal.reduce((a,b)=>parseInt(a)+parseInt(b)):0
        console.log('complete horizontal',verticalSumOfTotalhorizonalTime)

        return (
            <>
                <Button  color='teal' style={{float:'right',margin:'10px 10px 0px 0px'}} onClick={this.gotoLoginPage}>Logout</Button>
                <div style={{margin:'10px 5px 0px 10px',display:'inline'}}>
                <DateRangePicker style={{margin:'20px 10px 0px 10px'}}
                    onChange={this.handleDate}
                    value={this.state.date}
                    format="y-MM-dd"
                    clearIcon={null}
                />
                </div>
                

                <Grid style={{ display: 'inline' }}>
                    <Grid.Column width={4} style={{padding:'0px 0px 0px 20px'}}>
                        <Search style={{width:'100%'}}
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
                
                <Table responsive style={{borderBottom:'1px solid  rgba(211,211,211, 0.8)'}} >
                    <thead>
                        <tr>
                            <th style={{ width: '22px' }}>Users</th>
                             <th></th>
                             <th style={{borderRight:'1px solid rgba(211,211,211, 0.8)'}}> &#931;</th>
                            {
                                dateArr.map(i => <td key={i} >{moment(i).format('Dddd')}</td>)
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {
                            user = renderData.map((param,index) =>
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
    <tr><td></td><td></td><td style={{borderRight:'1px solid rgba(211,211,211, 0.8)'}}></td>{dateArr.map(i=><td></td>)}</tr>
                    </tbody>

                    <tfoot>
                        <tr>
                        <td></td>
                        <td style={{fontWeight:'bold'}}>Total</td>
                        
                        <td style={{borderRight:'1px solid rgba(211,211,211, 0.8)',fontWeight:'bold'}}>{ `${verticalSumOfTotalhorizonalTime}h`}</td>
                        {
                            varr.length!=0?
                            varr.map(i=><td style={{fontWeight:'bold'}}>{`${i.toFixed(2)}h`}</td>):0
                        }
                       
                        </tr>
                       
                    </tfoot>
                       
                </Table>
                

            </>
        );
    }



}

export default withRouter(Timesheet);