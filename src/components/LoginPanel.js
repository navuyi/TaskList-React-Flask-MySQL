import react from 'react';
import '../styles/noselect.css';
import styles from '../styles/loginPanel.module.css'
import {withRouter} from 'react-router-dom';
import axios from 'axios';


class LoginPanel extends react.Component{
  constructor(){
    super();
    this.state={
      username: "",
      password: ""
    }
    
    // Bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault();
    const url="http://127.0.0.1:5000/login";
    const data = {
      username: this.state.username,
      password: this.state.password
    }
    axios.post(url, data)
      .then(function(response){
        // Add access token and refresh token to local storage
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        this.props.handleSessionState(true, response.data.id);
        this.props.history.push("/home");
      }.bind(this))
      .catch(function(err){
        console.log(err.response.status);
      }.bind(this))
  }
  render(){
    
    return(
      <div>
        <div className={styles.loginPanel}>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.wrapper}>
            <label for="username" className={styles.label}> Username </label>
            <input
              type="text"
              name="username"
              className={styles.input}
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
          <div className={styles.wrapper}>
            <label for="password" className={styles.label}> Password </label>
            <input 
              type="password"
              name="password"
              className={styles.input}
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <button className={styles.button} type="submit"> Login now </button>
        </form>
          <div className={styles.underText}> or <a onClick={()=>{this.props.changeView()}} className={`${styles.underText} ${styles.signup} ${"noselect"}`}> sign up</a> </div>
        </div>
      </div>
    )
  }
}

export default withRouter(LoginPanel);