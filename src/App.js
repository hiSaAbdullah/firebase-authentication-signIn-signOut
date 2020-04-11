import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseconfig';
firebase.initializeApp(firebaseConfig)

function App() {
  const[user,setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    photo:''
  
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSingIn=()=>{
firebase.auth().signInWithPopup(provider)
.then(res=>{
  const {displayName,photoURL,email}=res.user;
  const signedInUser={
    isSignedIn: true,
    name:displayName,
    email: email,
    photo: photoURL
  }
  setUser(signedInUser);

  console.log(displayName,email,photoURL);
})
.catch(err=>{
  console.log(err);
  console.log(err.message);
})
  }

  const handleSingOut=()=>{
    firebase.auth().signOut()
    .then(res=>{
      const signOutUser={
        isSignedIn:false,
        name:'',
        photo:'',
        email:'',
        password:'',
        error:'',
        isValid:false,
        existingUser:false
      }
      setUser(signOutUser);
      console.log(res);
    }) 
    .catch(err=>{
      

    })

  }
  const isValidEmail=email=>/(.+)@(.+){2,}\.(.+){2,}/.test(email);

  const hasNumber=input=>/\d/.test(input)

  const switchFrom= event=>{
    const createdUser ={...user};
    createdUser.existingUser=event.target.checked;
    setUser(createdUser);
  }
 
    
  
  
  const handleChange=event =>{
    const newUserInfo={
      ...user
    };
  
// perform validation
    let isValid =true;
if(event.target.name==="email"){
  isValid =isValidEmail(event.target.value);
}
if(event.target.name === "password"){
  isValid=event.target.value.length >8 && hasNumber(event.target.value);
}

    newUserInfo[event.target.name]=event.target.value;
    newUserInfo.isValid =isValid;
    setUser(newUserInfo);

    //console.log(newUserInfo);
  }
  const createAccount=(event)=>{
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
      .then(res=> {
        console.log(res);
          const createdUser ={...user};
          createdUser.isSignedIn=true;
          createdUser.error='';
          setUser(createdUser)
      })
      .catch(err=>{
        console.log(err.message);
        const createdUser ={...user};
        createdUser.isSignedIn=false;
        createdUser.error=err.message;
        setUser(createdUser);
      })
    }


    event.preventDefault();
    event.target.reset();
  }
  const signInUser=event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email,user.password)
      .then(res=> {
        console.log(res);
          const createdUser ={...user};
          createdUser.isSignedIn=true;
          createdUser.error='';
          setUser(createdUser)
      })
      .catch(err=>{
        console.log(err.message);
        const createdUser ={...user};
        createdUser.isSignedIn=false;
        createdUser.error=err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }
  return(
    <div className='App'>
      {
        user.isSignedIn ?<button onClick={handleSingOut}>Sign Out</button> :
        <button onClick={handleSingIn}>Sign In</button>
      }
      
      {
        user.isSignedIn && <div>
          <p>Welcome,{user.name}</p>
          <p>Your Email:{user.email}</p>
          <img src={user.photo} alt=""/>
        </div>

      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" name="switch" onChange={switchFrom} id="switchFrom"/>
      <label htmlFor="switchFrom">Returning User </label>
      <form style={{display:user.existingUser ? 'block':'none'}} onSubmit={signInUser}>
      <input type="text" onBlur={handleChange} name="email" placeholder="Enter Your Email" required/>
      <br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password" required/>
      <br/>
      <input type="submit" value="SignIn"/>
      </form>
      <form style={{display:user.existingUser ? 'none':'block'}} onSubmit={createAccount}>
      <input type="text" onBlur={handleChange} name="name" placeholder="Enter Your Name" required/>
      <br/>
      <input type="text" onBlur={handleChange} name="email" placeholder="Enter Your Email" required/>
      <br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password" required/>
      <br/>
      <input type="submit" value="create Account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
    </div>
  );
}


export default App;
