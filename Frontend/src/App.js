import { BrowserRouter as Router, Switch, Route, Link, useHistory, Redirect} from "react-router-dom";
import React from 'react';
import axios from 'axios';



import Start from './subpages/Start';
import Home from './subpages/Home';

class App extends React.Component {
  constructor(){
    super();
    this.state={
      isLoggedIn: false,
      id: null,
    }

    // Bindings
    this.handleSessionState = this.handleSessionState.bind(this);
    this.refresh_token = this.refresh_token.bind(this);
  }
  handleSessionState(log_state, id){
    this.setState({
      isLoggedIn: log_state,
      id: id
    }, ()=>{
      console.log(this.state);
    });
  }
  refresh_token(){
    const refresh_token = localStorage.getItem("refresh_token");
    axios.get("http://localhost:5000/refresh_token", {
      headers: {
        'Authorization': `Bearer ${refresh_token}`
      }
    }).then(function(response){
      console.log("Adding fresh access token to localstorage");
      localStorage.setItem("access_token", response.data.access_token);
    }.bind(this)).catch((err) =>{
      console.log(err);
    })
  }
  render(){
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <Start {...this.state} handleSessionState={this.handleSessionState}/>
            </Route>
            <Route path="/home">
              <Home {...this.state} refresh_token={this.refresh_token} handleSessionState={this.handleSessionState}/>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default App;
