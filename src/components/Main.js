import React from 'react'
import Card from './Card'
export default function  Main(props) {

    return <div style = {props.style}>
    {
      props.data.map((el)=><Card key= {el.id} color = {props.color} data = {el}/>)  
    }
    </div>

}