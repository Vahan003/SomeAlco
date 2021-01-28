import React  from "react";

//import Icon from "../icons/wine-bottle-solid.svg";
//import IconSub from "../icons/seedling.svg";
import { aside } from "../styles/screens.style";

export default function AsideCustom(props) {
  const setCurrentSelection = props.selection;
 // const [open, setOpen] = React.useState(false);

 

  return (
    <div style={aside()}>
      <nav>
        {props.data.map((el) => (
          <ul key={el.id}>
            {el.name}
            {
              <button
                onClick={
                  !props.disable
                    ? (e) => {
                        console.log("yes")
                        props.setDisable(true);
                        setCurrentSelection({
                          category: el.id,
                          type: ""
                        });
                      }
                    : () => {}
                }
              >Search</button>
            }
            {el.type?.map((e, ind) => (
              <li key = {ind}>{e}
              {<button
                onClick={
                    !props.disable
                      ? () => {
                        props.setDisable(true)
                          setCurrentSelection({
                            category: "",
                            type: e,
                          });
                         
                        }
                      : () => {}
                  }
              >Search</button>}
              </li>
            ))}
          </ul>
        ))}
      </nav>
    </div>
  );
}
