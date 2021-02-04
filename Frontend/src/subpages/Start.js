import react from 'react';
import '../styles/noselect.css';
import styles from './start.module.css';

import LoginPanel from '../components/LoginPanel';
import RegisterPanel from '../components/RegisterPanel';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
class Start extends react.Component{
  constructor(){
    super();
    this.state={
      isLoginVisible: true
    }
    
    // Bindings
    this.changeView = this.changeView.bind(this);
  }
  changeView(){
    this.setState({
      isLoginVisible: !this.state.isLoginVisible
    })
  }

  render(){
    return(
      <div>
        <div className={styles.background}></div>
        {
          this.state.isLoginVisible ? 
          <LoginPanel changeView={this.changeView} handleSessionState={this.props.handleSessionState} /> : 
          <RegisterPanel changeView={this.changeView}/>
        }
      </div>
    )
  }
}

export default Start;