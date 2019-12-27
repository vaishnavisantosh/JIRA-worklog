import React,{Component} from 'react';


class ErrorBoundary extends Component{
    state={
        hasError:false,
        errMsg:""
    }

    componentDidCatch(error,msg){
        this.setState({
            hasError:true,
            errMsg:msg
        });
    }
  
    
    render(){
        if(this.state.hasError){
            return(
                <div>
                    <p>Someting went wrong!!!!</p>
                </div>
            )
        }

         return this.props.children;

        
    }
} 


export default ErrorBoundary;