import react from 'react';
import '../styles/noselect.css';
import styles from './home.module.css';
import TaskAdd from '../components/TaskAdd';
import TaskList from '../components/TaskList';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';

class Home extends react.Component{
  constructor(){
    super();
    this.state={
      taskList: []
    }
    
    // Bindings
    this.fetchData = this.fetchData.bind(this);
  }


  componentDidMount(){
    if(this.props.isLoggedIn==false){
      this.props.history.push("/");
    }
    this.fetchData();
  }

  fetchData(){
    const url="http://127.0.0.1:5000/taskList";
    const access_token = localStorage.getItem("access_token");
    const data = {
      id: this.props.id
    }
    const header = {
      headers:{
        "Authorization": `Bearer ${access_token}`
      }
    }
    axios.post(url, data, header)
    .then(function(response){
      console.log(response);
      var tmp_taskList = [];
      response.data.map((task) =>{
        var is_done;
        if(task[2]===1){is_done=true}else{is_done=false}
        var task = {"id": task[0], "task": task[1], "is_done": is_done}
        tmp_taskList.push(task);
      })
      this.setState({
        taskList: tmp_taskList
      })
    }.bind(this))
    .catch(function(err){
      console.log(err)
      if(err.response.status==422){
        this.props.refresh_token();
      }
    }.bind(this))
  }
  render(){
    return(
      <div>
        <div className={styles.background}></div>
        <TaskAdd {...this.props} {...this.state} refresh_token={this.props.refresh_token} fetchData={this.fetchData} handleSessionState={this.props.handleSessionState}/>
        <TaskList {...this.props} {...this.state} refresh_token={this.props.refresh_token}  fetchData={this.fetchData}/>
      </div>
    )
  }
}

export default withRouter(Home);