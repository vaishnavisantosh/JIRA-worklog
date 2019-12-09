import React, { Component } from 'react';
// import {} from 'semantic-ui-react';
import { Button, Table } from 'react-bootstrap';
// import 'bootstrap-daterangepicker/daterangepicker.css';
//  import {DatetimeRangePicker} from 'react-bootstrap-datetimerangepicker';
import User from '../../Component/User/User';
import * as moment from "moment";
const base64 = require('base-64');


class Timesheet extends Component {

    state={
        user:[]
    }


    componentDidMount() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append('Authorization', 'Basic ' + base64.encode('vaishnavi.jawanjal@cuelogic.com:76cUIpriuCh9iNmcdrWe07D4'));
        let arr=[];
        fetch('https://vaishnavijawanjal.atlassian.net/rest/api/2/user/assignable/search?project=REAC', { method: 'GET', headers: headers })
            .then(res => res.json())
            .then(res => {
                for(let key in res){
                    arr.push({
                        id:res[key].accountId,
                        avatarUrls:Object.values(res[key].avatarUrls)[3],
                        name:res[key].displayName

                    });

                }
                console.log("response", res);
                console.log("user array",arr)
                this.setState({user:arr})
                console.log("state",this.state.user);

            }

            );
            

    }

    render() {
        console.log("inside renderrrrrrr",this.state.user);
let user;
        return (
            <>
                <Table responsive>
                    <thead>
                        <tr>
                            
                            <th >Users</th>
                            <th></th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>
                            <th>Table heading</th>


                        </tr>
                    </thead>
                    <tbody>
                        {
                            user=this.state.user.map(param=>
                              
                        <User
                            key={param.id}
                            name={param.name}
                            avatarUrls={param.avatarUrls}/>
                            

                       
                            )}
                            

                        {/* <tr>
                            <td>1</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>

                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>

                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                            <td>Table cell</td>
                        </tr> */}
                    </tbody>
                </Table>

            </>
        );
    }



}

export default Timesheet;