export const card = (rest) =>({
    ...rest,
    display: "flex",
    backgroundColor: "#fff",
    marginLeft: "1.6rem",
    marginBottom: "1.6rem",
    borderRadius: "0.6rem",
})
export const cardTop = (rest) =>({
    ...rest,
   display: "flex",
   flexDirection: "row",
   justifyContent: "space-between"
   
})

export const cardMiddle = (rest) =>({
    ...rest,
    display: "flex",
    flexDirection: "row",
    flex: 3,
    justifyContent: "space-between"
})
export const cardEnd = (rest) =>({
    ...rest,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
})

export const cardRight = (rest) =>({
    ...rest,
    display: "flex",
   flexDirection: 'column',
   flex: 8,
   justifyContent: "space-between",
   padding: "0 0 0 1.6rem",
  
   
})

export const cardLeft = (rest) =>({
    ...rest,
    position: "relative",
    display: "flex",
    flex: 4,
    minWidth: "16rem",
    minHeight: "16rem",
    overflowY: "hidden",
    overflowX: "hidden",
    justifyContent: 'center',
    margin: "0.4rem",
    borderRadius: "0.6rem",
})

export const button = (rest) =>({
    ...rest,
    display: "flex",
    justifyContent: 'center',
    padding :"0.6rem",
    fontFamily: "'Montserrat Alternates', sans-serif"

})

export const text = (rest) =>({
    ...rest,
    paddingTop: "10px",
    fontSize: "90%",
    fontWeight:  "bold"
})