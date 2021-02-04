import react from 'react';
import styles from '../styles/navbar.module.css';
import '../styles/noselect.css';




class Navbar extends react.Component{
  constructor(){
    super();

    
    // Bindings
  }

  render(){
    return(
      <div className={`${styles.navbar} ${"noselect"}`}>
        <div className={styles.button}> Cards </div>
        <div className={styles.button}> Photos </div>  
        <div className={styles.button}> Another1 </div>  
        <div className={styles.button}> Other2 </div>   
      </div>
    )
  }
}

export default Navbar;