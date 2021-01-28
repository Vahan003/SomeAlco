export const screen = (rest) => ({
       ...rest,
       position: 'relative',
       display: 'flex',
       flexDirection: 'row',
       marginTop: "0",
       maxHeigth: "100vh",
       maxWidth: "100vw",
       paddingTop: "13vh"
})

export const aside = (rest) => ({
    ...rest,
    flex: "3",
    width: "30%",
    position: "fixed",
    zIndex: "2",
})

export const main = (rest) => ({
    ...rest,
    position: 'relative',
    flex: "6",
    marginLeft: "30%"
})

export const side = (rest) => ({
    ...rest,
    flex: "3",
    margin: "0",

})
export const loading = (rest) => ({
    ...rest,
    position: 'absolute',
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    background: "none",
    width: "100%",
    top: "40%",
})