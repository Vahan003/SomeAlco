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
  const { name, owner, description, about, price, url, category, type } = props.data;
  return (
    <div style={card({ borderBottom: `0.1rem solid ${props.color.backgroundColor}` })}>
      <div style={cardLeft({ borderRight : `0.1rem solid ${props.color.backgroundColor}` })}>
        <img className = "card_img" src={url || UserIcon} alt = "#"></img>
      </div>
      <div style={cardRight()}>
        <div style={cardTop()}>
          <div style = {text({ color: `${props.color.backgroundColor}` })}>{name}</div>
          <div>
            {owner ? (
              <button style={button({...props.color, ...{borderRadius: "0 0.6rem 0 0.3rem", boxShadow: `0 0 0 0.3rem ${props.color.backgroundColor}`}})}>Created By</button>
            ) : (
              <button style={button({...props.color, ...{borderRadius: "0 0.6rem 0 0.3rem", boxShadow: `0 0 0 0.3rem ${props.color.backgroundColor}`}})}>Products</button>
            )}
          </div>
        </div>
        <div style={cardMiddle()}>
          <div><p>{owner ? description : about}</p></div>
          <div><p>{owner ? "" : category}</p><p> {owner ? type : ""}</p></div>
        </div>
        <div style={cardEnd()}>
          {owner ? (
            <button style={button({...props.color, ...{borderRadius: "0.3rem 0.3rem 0 0", boxShadow: `0 0.3rem 0 0 ${props.color.backgroundColor}`}})}>{price}</button>
          ) : (
            <button style={button({...props.color, ...{borderRadius: "0.3rem 0.3rem 0 0", boxShadow: `0 0.3rem 0 0 ${props.color.backgroundColor}`}})}>More</button>
          )}
          {
            //Icon of send or buy
            owner ? (
              <button style={button({...props.color, ...{borderRadius: "0.3rem 0 0.6rem 0", boxShadow: `0 0 0 0.3rem ${props.color.backgroundColor}`}})}>BUY</button>
            ) : (
              <button style={button({...props.color, ...{borderRadius: "0.3rem 0 0.6rem 0", boxShadow: `0 0 0 0.3rem ${props.color.backgroundColor}`}})}>CONTACT</button>
            )
          }
        </div>
      </div>
    </div>
  );
}
