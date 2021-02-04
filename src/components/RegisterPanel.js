import react from 'react';
import '../styles/noselect.css';
import styles from '../styles/registerPanel.module.css';
import axios from 'axios';
import icon from '../images/register.png';
class RegisterPanel extends react.Component{
  constructor(){
    super();
    this.state={
      username: "",
      password: "",
      passwordRepeat: "",
      isButtonVisible: true,
      errorText: ""
    }
    
    // Bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value,
      isButtonVisible: true
    })
    console.log(this.state);
  }
  handleSubmit(e){
    e.preventDefault();
    if(this.state.password===this.state.passwordRepeat){
      const url="http://127.0.0.1:5000/register";
      const data = {
        username: this.state.username,
        password: this.state.password
      }
      axios.post(url, data)
        .then(function(response){
          console.log(response.status);
          if(response.status==204){
            this.props.changeView();
          }
        }.bind(this))
        .catch(function(err){
          console.log(err.response.status);
          if(err.response.status==500){
            this.setState({
              errorText: "User already exists",
              isButtonVisible: false,
              username: "",
              password: "",
              passwordRepeat: ""
            })
          }
        }.bind(this))
    }
    else{
      // Passwords must be the same
      this.setState({
        errorText: "Password must be the same",
        isButtonVisible: false,
        password: "",
        passwordRepeat: ""
      })
    }
  }

  render(){
    return(
      <div className={styles.main}>
        
        <form onSubmit={this.handleSubmit}>
          <img className={styles.icon} src={icon}></img>
          <input
            type="text"
            className={styles.input}
            placeholder="Username"
            onChange={this.handleChange}
            name="username"
            required
            value={this.state.username}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            onChange={this.handleChange}
            name="password"
            required
            value={this.state.password}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Repeat password"
            onChange={this.handleChange}
            name="passwordRepeat"
            required
            value={this.state.passwordRepeat}
          />
          {this.state.isButtonVisible ? <button> Register </button> : <p> {this.state.errorText} </p>}
        </form>
      </div>
    )
  }
}

export default RegisterPanel;