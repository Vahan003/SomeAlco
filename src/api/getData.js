import Firebase from "../firebase/firebase";

export function getProduct(setProduct, setLoading) {
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
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getPerson(setPerson, setLoading) {
  Firebase.db
    .collection("person")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const image = Firebase.storeRef.child(`${doc.data().src}`);
        image.getDownloadURL().then((url) => {
          const p = doc.data();
          const obj = { id: doc.id, url: url, ...p };
          setPerson((prev) => [...prev, obj]);
        });
      });
    })
    .then(() => {
      setLoading(false);
    });
}

export function getCategory(setCategory) {
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
}

export function getProductBy1(
  { category, type },
  setProduct,
  product,
  setDisable,
  setCurrentSelection
) {
  let ref = Firebase.db.collection("product");
  let query;
  if (type) {
    query = ref.where("type", "==", type);
  } else if (category) {
    query = ref.where("category", "==", category);
  } else {
    console.log("niennnn");
    return;
  }
  query
    .get()
    .then((querySnapshot) => {
      setProduct((prev) => []);
      
      querySnapshot.forEach(async (doc) => {
        const image = Firebase.storeRef.child(`${doc.data().src}`);
         await image
          .getDownloadURL()
          .then((url) => {
            const p = doc.data();
            const obj = { id: doc.id, url: url, ...p };
            return obj;
          })
          .then((d) => {
            setProduct((prev) => [...prev, d]);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getProductBy(
  { category, type },
  setProduct,
  product
) {
  let ref = Firebase.db.collection("product");
  let query;
  if (type) {
    query = ref.where("type", "==", type);
  } else if (category) {
    query = ref.where("category", "==", category);
  } else {
    return;
  }
  query
    .get()
    .then(async(querySnapshot) => {
      setProduct(prev => []);
      querySnapshot.forEach(async (doc) => {
        let data = doc.data()
        const image = Firebase.storeRef.child(`${data.src}`);
        let url =  await image.getDownloadURL()
        const obj = { id: doc.id, url: url, ...data };
        if(!product.length){
          setProduct([obj])
        }
        else {
          setProduct((prev) => {
            if(!(prev.find((el)=>el.id === obj.id))) {
              return [...prev, obj]
            }
            else{
              return [...prev]
            }
            });
        }
      })
    })
    .catch((err) => {
      console.log(err);
    });
}