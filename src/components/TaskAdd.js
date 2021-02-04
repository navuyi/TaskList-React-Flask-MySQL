import react from 'react';
import '../styles/noselect.css';
import styles from '../styles/taskAdd.module.css';
import {Link, withRouter} from 'react-router-dom';
import axios from 'axios';

class TaskAdd extends react.Component{
  constructor(){
    super();
    this.state={
      task: ""
    }
    
    // Bindings
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.logout = this.logout.bind(this);
  }
  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.submit();
  }
  submit(){
    const url="http://127.0.0.1:5000/newTask";
    const data = {
      task: this.state.task,
      id: this.props.id
    }
    const access_token = localStorage.getItem("access_token");
    const header = {
      headers:{
        "Authorization": `Bearer ${access_token}`
      }
    }
    axios.post(url, data, header)
    .then(function(response){
      console.log(response);
      this.setState({
        task: ""
      })
      this.props.fetchData();
    }.bind(this))
    .catch(function(err){
      console.log(err);
      if(err.response.status==422){
        this.props.refresh_token();
        this.submit();
      }
    }.bind(this))
  }

  logout(){
    this.props.handleSessionState(false, null);
    localStorage.clear();
    this.props.history.push("/");
  }

  render(){
    return(
      
      <div className={styles.main}>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="task"
              className={styles.taskInput}
              placeholder="Place for your task"
              value={this.state.task}
              onChange={this.handleChange}
              required
            />
            <button className={styles.addButton}> Add </button>
            
            
          </form> 
          <div className={styles.icon}> </div>
          <button className={styles.logoutButton} onClick={this.logout}> Log out </button>
          
      </div>
    )
  }
}

export default withRouter(TaskAdd);