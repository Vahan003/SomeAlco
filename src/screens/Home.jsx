import React, { useState, useEffect } from "react";
import Aside from "../components/Aside";
import Main from "../components/Main";
import Side from "../components/Side";
import Firebase from "../firebase/firebase";
import Loading from "../components/Loading";
import { screen, main, side } from "../styles/screens.style";

export default function Home(props) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  useEffect(() => {
    Firebase.db
     .collection("category")
     .get()
     .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const p = doc.data();
        const obj = {
          id: doc.id,
          ...p,
        };
        setCategory((prev) => [...prev, obj]);
      });
    });
    Firebase.db
      .collection("product")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const image = Firebase.storeRef.child(`${doc.data().src}`);
          image.getDownloadURL().then((url) => {
            const p = doc.data();
            const obj = { id: doc.id, url: url, ...p };
            setProduct((prev) => [...prev, obj]);
          });
        });
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {!loading ? (
        <div style={screen()}>
          <Aside data={category} color={props.color} />
          <Main data={product} style={main()} color={props.color} />
          <Side style={side()} color={props.color} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
