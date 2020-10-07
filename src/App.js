import React,{useState,useLocation, useEffect} from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {navigation, navigationLi, navigationA, header,top} from './styles/App.style'
import Home from './screens/Home'
import Users from './screens/Users'
import Admin from './screens/Admin'
import Header from './components/Header'
import {colors} from './themes/constants'

import './styles/style.css'

export default function App() {
  const {color1,color2,color3,color4,color5,color6} = colors

  const [pressed,setPressed] = useState("home")
  const [mainTheme,setMainTheme] = useState({colorChange : {...color3}, colorMain: {...color4}})
 
  const {colorChange,colorMain } = mainTheme

  const changeTheme = (colorX,colorY)=>{
    setMainTheme({
      colorChange : {...colorX}, 
      colorMain: {...colorY}
    })
  }
  useEffect(()=>{
   return () =>{
   
   }
  },[])
  return (
    <Router>
      <div >
      <div style={top()}>
      <Header style  = {header(colorChange)}/>
        <nav style = {top()}>
          <ul style = {navigation(colorChange)}>
            <li style = {navigationLi(pressed === "home" ? colorMain: colorChange)}>
              <Link style ={navigationA(pressed === "home" ? colorMain: colorChange)} to="/" onClick = {()=>{setPressed("home"); changeTheme(color1,color2)}}>Home</Link>
            </li>
            {
            // <li style = {navigationLi(pressed === "about" ? colorMain: colorChange)}>
            //   <Link style ={navigationA(pressed === "about" ? colorMain: colorChange)} to="/about" onClick = {()=>{setPressed("about"); changeTheme(color3,color4)}}>About</Link>
            // </li>
            }
            <li style = {navigationLi(pressed === "users" ? colorMain: colorChange)}>
              <Link  style ={navigationA(pressed === "users" ? colorMain: colorChange)} to="/users" onClick = {()=>{setPressed("users"); changeTheme(color5,color6)}}>Users</Link>
            </li>
          </ul>
        </nav>
        </div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            
         <Switch>
         {
        //   <Route path="/about">
        //     <About />
        //   </Route>
          <Route path="/users">
            <Users color = {colorChange} />
          </Route>
            }
          <Route path = "/admin">
         {
          <Admin/>
         }
          </Route>
          <Route path="/">
            <Home color = {colorChange}/>
            </Route>
          <Route path="*">
          <NotFound/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


function NotFound( ){
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}