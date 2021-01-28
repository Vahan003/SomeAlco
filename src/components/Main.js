import React from 'react'
import Card from './Card'
import Loading from "../components/Loading";
import { loading } from "../styles/screens.style";
export default function  Main(props) {

    return (
    <div style = {props.style}>
    {
      props.data.length !== 0 ? 
      props.data.map((el)=><Card key= {el.id} color = {props.color} data = {el}/>) :
      <Loading style={loading()}/>    
      }
    </div>
    );
}