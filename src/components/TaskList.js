import axios from 'axios';
import react from 'react';
import '../styles/noselect.css';
import styles from '../styles/taskList.module.css';

class TaskList extends react.Component{
  constructor(){
    super();
    this.state = {
      task_id: "",
      operation: ""
    }
    
    // Bindings
    this.handleClick = this.handleClick.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.confirmTask = this.confirmTask.bind(this);
  }
  handleClick(e){
    const operation = e.target.getAttribute("name");
    this.setState({
      task_id: e.target.id,
      operation: e.target.getAttribute("name")
    }, ()=>{
      switch(operation){
        case 'delete':
          this.deleteTask();
        case 'confirm':
          this.confirmTask();
      }
    })
  }
  deleteTask(){
    const url="http://127.0.0.1:5000/deleteTask";
    const data = {
      task_id: this.state.task_id
    }
    const access_token = localStorage.getItem("access_token");
    const header = {
      headers:{
        "Authorization": `Bearer ${access_token}`
      }
    } 
    axios.post(url,data,header)
    .then(function(response){
      console.log(response);
      this.props.fetchData();
    }.bind(this))
    .catch(function(err){
      console.log(err.response)
      if(err.response.status==422){
        this.props.refreshToken();
      }
    }.bind(this))
  }
  confirmTask(){
    const url="http://127.0.0.1:5000/confirmTask";
    const data = {
      task_id: this.state.task_id
    }
    const access_token = localStorage.getItem("access_token");
    const header = {
      headers:{
        "Authorization": `Bearer ${access_token}`
      }
    } 
    axios.post(url,data,header)
    .then(function(response){
      console.log(response);
      this.props.fetchData();
    }.bind(this))
    .catch(function(err){
      console.log(err.response)
      if(err.response.status==422){
        this.props.refreshToken();
      }
    }.bind(this))
  }

  render(){
    return(
      <div className={styles.main}>
        {this.props.taskList.map((task)=>{
          var containerStyle;
          var imageStyle;
          task.is_done ? containerStyle={backgroundColor: "rgb(4, 156, 24, 0.808"} : containerStyle={backgroundColor: "rgb(5, 96, 170, 0.808"}
          task.is_done ? imageStyle={visibility: "hidden"} : imageStyle=null
          return(
            <div className={styles.container} style={containerStyle}>
              <p> {task.task} </p>
              <div className={`${styles.doneIcon} ${styles.icon}`} id={task.id} name="confirm" onClick={this.handleClick} style={imageStyle}></div>
              <div className={`${styles.deleteIcon} ${styles.icon}`} id={task.id} name="delete" onClick={this.handleClick}></div>
            </div>
          )
        })}
        
      </div>
    )
  }
}

export default TaskList;