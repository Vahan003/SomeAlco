import React from "react";
import {
  card,
  cardRight,
  cardTop,
  cardMiddle,
  cardEnd,
  cardLeft,
  button,
  text,
} from "../styles/Card.style";
import UserIcon from "../icons/user-regular.svg";
export default function Card(props) {
  const { name, owner, description, about, price, url } = props.data;
  return (
    <div style={card({ borderBottom: `2px solid ${props.color.backgroundColor}` })}>
      <div style={cardLeft({ borderRight : `1.5px solid ${props.color.backgroundColor}` })}>
        <img className = "card_img" src={url || UserIcon} ></img>
      </div>
      <div style={cardRight()}>
        <div style={cardTop()}>
          <div style = {text({ color: `${props.color.backgroundColor}` })}>{name}</div>
          <div>
            {owner ? (
              <button style={button({...props.color, ...{borderRadius: "0 10px 0 5px", boxShadow: `0 0 0 5px ${props.color.backgroundColor}`}})}>Created By</button>
            ) : (
              <button style={button({...props.color, ...{borderRadius: "0 10px 0 5px", boxShadow: `0 0 0 5px ${props.color.backgroundColor}`}})}>Products</button>
            )}
          </div>
        </div>
        <div style={cardMiddle()}>
          <div>{owner ? description : about}</div>
        </div>
        <div style={cardEnd()}>
          {owner ? (
            <button style={button({...props.color, ...{borderRadius: "5px 5px 0 0", boxShadow: `0 5px 0 0 ${props.color.backgroundColor}`}})}>{price}</button>
          ) : (
            <button style={button({...props.color, ...{borderRadius: "5px 5px 0 0", boxShadow: `0 5px 0 0 ${props.color.backgroundColor}`}})}>More</button>
          )}
          {
            //Icon of send or buy
            owner ? (
              <button style={button({...props.color, ...{borderRadius: "5px 0 10px 0", boxShadow: `0 0 0 5px ${props.color.backgroundColor}`}})}>BUY</button>
            ) : (
              <button style={button({...props.color, ...{borderRadius: "5px 0 10px 0", boxShadow: `0 0 0 5px ${props.color.backgroundColor}`}})}>CONTACT</button>
            )
          }
        </div>
      </div>
    </div>
  );
}
