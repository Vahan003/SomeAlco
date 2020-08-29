export const screen = (rest) => ({
       ...rest,
       display: 'flex',
       flexDirection: 'row',
       marginTop: "0",
       maxHeigth: "85vh",
       paddingTop: "11vh"
})

export const aside = (rest) => ({
    ...rest,
    flex: "3",
    width: "350px",
    position: "fixed"
})

export const main = (rest) => ({
    ...rest,
    flex: "6",
    marginLeft: "400px"
})

export const side = (rest) => ({
    ...rest,
    flex: "3",
    margin: "10px",

})
export const loading = (rest) => ({
    ...rest,
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
    width: "100%",
    height: "100%"
})