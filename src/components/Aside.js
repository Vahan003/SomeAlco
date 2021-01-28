import React from "react";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Icon from "../icons/wine-bottle-solid.svg";
import IconSub from "../icons/seedling.svg";
import { aside } from "../styles/screens.style";

export default function Aside(props) {
  const setCurrentSelection = props.selection;
  const useStyles = makeStyles((theme) => {
    //console.log(theme)
    return {
      root: {
        width: "100%",
        minHeight: "85vh",
        maxWidth: 360,
        paddingLeft: "0.6rem",
        backgroundColor: `${props.color.backgroundColor}`,
        color: `${props.color.color}`,
      },
      nested: {
        paddingLeft: theme.spacing(4),
      },
    };
  });

  const theme = createMuiTheme({
    typography: {
      fontFamily: "'Montserrat Alternates', sans-serif",
    },
  });
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClick = (str) => {
    setOpen(str);
    if(str){
      props.setDisable(true)
      setCurrentSelection((prev) => ({
        ...prev,
        category: str,
      }));
    }
    else{
      
    }
  };

  return (
    <div style={aside()}>
      <ThemeProvider theme={theme}>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={<div id="nested-list-subheader">Categories</div>}
          className={classes.root}
        >
          {props.data.map((el, index) => (
            <div key={index}>
              <ListItem
                button
                onClick={
                  !props.disable
                  ? () => {
                  open !== el.id ? handleClick(el.id) : handleClick("");
                }
                : () => {}
              }
              >
                <ListItemIcon>
                  <img src={Icon} width="30rem" alt = ">>"></img>
                </ListItemIcon>
                <ListItemText primary={el.name} />
                {open !== el.id ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={open === el.id} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {el.type?.map((e, ind) => (
                    <ListItem
                      key={ind}
                      button
                      className={classes.nested}
                      onClick={
                        !props.disable
                          ? () => {
                            props.setDisable(true)
                              setCurrentSelection((prev) => ({
                                ...prev,
                                type: e,
                              }));
                             
                            }
                          : () => {}
                      }
                    >
                      <ListItemIcon>
                        <img src={IconSub} width="20rem" alt=">"></img>
                      </ListItemIcon>
                      <ListItemText primary={e} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </ThemeProvider>
    </div>
  );
}
