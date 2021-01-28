import React, { useState, useEffect } from "react";
import Aside from "../components/Aside";
import Main from "../components/Main";
import Side from "../components/Side";
import { getCategory, getProduct, getProductBy } from "../api/getData";
import Loading from "../components/Loading";
import { screen, main, side } from "../styles/screens.style";

export default function Home(props) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [disable, setDisable] = useState(false);
  const [currentSelection, setCurrentSelection] = useState({
    category: "",
    type: "",
  });
  useEffect(() => {
    getCategory(setCategory);
    getProduct(setProduct, setLoading);
  }, []);

  useEffect(() => {
    getProductBy(currentSelection, setProduct, product, setDisable,setCurrentSelection);
    setCurrentSelection({
      category: "",
      type: "",
    });
  }, [disable]);

  useEffect(()=>{
    setDisable(false);
  }, [currentSelection])
  
  return (
    <div>
      {!loading ? (
        <div style={screen()}>
          <Aside
            data={category}
            selection={setCurrentSelection}
            disable={disable}
            setDisable={setDisable}
            color={props.color}
          />
          <Main data={product} style={main()} color={props.color} />
          <Side style={side()} color={props.color} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
