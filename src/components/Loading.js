import React from 'react'
import load from '../icons/loading.gif'
import {loading} from '../styles/screens.style'

export default function  Loading (){
    
    return (<div style = {loading()}>
        <img className = "loader" src = {load} alt = "LOADING..."></img>
        </div>)
}
