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
  const singnedInUser={
    isSignedIn: true,
    name:displayName,
    email: email,
    photo: photoURL
  }
  setUser(singnedInUser);

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
        email:''
      }
      setUser(signOutUser);
      console.log(res);
    }) 
    .catch(err=>{
      

    })

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
    </div>
  );
}


export default App;
