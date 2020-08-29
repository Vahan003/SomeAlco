import React, {useState, useEffect} from 'react';
import { makeStyles, createMuiTheme} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
//import StarBorder from '@material-ui/icons/StarBorder';
//import SvgIcon from '@material-ui/core/SvgIcon'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Icon from '../icons/wine-bottle-solid.svg'
import IconSub from '../icons/seedling.svg'
import {aside} from '../styles/screens.style'


export default function Aside(props) {

  const useStyles = makeStyles((theme) => {
    console.log(theme)
    return ({
    root: {
      width: '97%',
      minHeight: '85vh',
      maxWidth: 360,
      paddingLeft: "10px",
      backgroundColor: `${props.color.backgroundColor}`,
      color: `${props.color.color}`,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
  });

  const theme = createMuiTheme({
    typography: {
      fontFamily: "'Montserrat Alternates', sans-serif",
    },
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = (str) => {
    setOpen(str);
  };

  return (
    <div style= {aside()}>
    <ThemeProvider theme={theme}>
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Categories
        </ListSubheader>
      }
      className={classes.root}
    >
      { 
        props.data.map((el,index)=><div key = {index}>
      <ListItem  button onClick={()=> {open !== el.name ? handleClick(el.name): handleClick("") }}>
        <ListItemIcon>
        <img src={Icon} width = "30px"></img>
        </ListItemIcon>
        <ListItemText primary={el.name} />
        {open !== el.name ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
     
      <Collapse in={open === el.name} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {
            el.type.map((el,ind)=><ListItem  key = {ind} button className={classes.nested}>
            <ListItemIcon >
            <img src={IconSub} width = "20px"></img>
            </ListItemIcon>
            <ListItemText primary={el} />
          </ListItem>)  
          }
        </List>
          
      </Collapse> 
      </div>)
        
    }
    </List>
    </ThemeProvider>
    </div>
  );
}
