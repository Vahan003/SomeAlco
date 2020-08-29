export const card = (rest) =>({
    ...rest,
    display: "flex",
    backgroundColor: "#fff",
    marginLeft: "10px",
    marginBottom: "15px",
    borderRadius: "10px",
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
   padding: "0 0px 0 10px",
  
   
})

export const cardLeft = (rest) =>({
    ...rest,
    display: "flex",
    flex: 4,
    minWidth: "149px",
    maxWidth: "155px",
    maxHeight: "155px",
    minHeight: "149px",
    overflowY: "hidden",
    overflowX: "hidden",
    justifyContent: 'center',
    padding: "10px",
})

export const button = (rest) =>({
    ...rest,
    display: "flex",
    justifyContent: 'center',
    padding :"10px",
    fontFamily: "'Montserrat Alternates', sans-serif"

})

export const text = (rest) =>({
    ...rest,
    paddingTop: "10px",
    fontSize: "90%",
    fontWeight:  "bold"
})