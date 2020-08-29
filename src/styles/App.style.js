export const navigation = (rest) => ({
  ...rest,
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  width: "100%",
  listStyleType: "none",
  transition: "0.6s ease",
  margin: 0,
  padding:0
});

export const navigationLi = (rest) => ({
  ...rest,
  textDecorationStyle : "none",
  padding: "1.7vh",
  transition: "0.3s ease"
});

export const navigationA =(rest) =>({
  ...rest,
  textDecoration: "none",
  borderRadius: "50%",
  padding: "1.5vh",
  transition: "0.2s ease"
});

export const header = (rest) =>({
  ...rest,
  width: "100%",
  transition: "0.6s ease",
  paddingTop: "1vh",
  paddingBottom: "1vh",
  margin: 0,
});

export const top = (rest) =>({
  ...rest,
  width: "100%",
  position: "fixed",
  zIndex: "2",
  margin: 0,
});