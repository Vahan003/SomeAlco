import React, { useState, useEffect } from "react";
import Firebase from "../firebase/firebase";
export default function Admin(props) {
  const style = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    margin: "10px",
    border: "1px solid grey",
  };
  const styleRed = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    margin: "10px",
    border: "1px solid red",
  };
  const styleGreen = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    margin: "10px",
    border: "1.5px solid green",
  };
  const styleItem = {
    padding: "5px",
  };
  const styleSc = {
    display: "flex",
    paddingTop: "11vh",
  };
  const textArea = {
    height: "200px",
    flex: 1,
  };
  const styleB = {
    padding: "5px",
    margin: "5px",
    width: "45%",
  };
  const displayNone = {
    visibility: "hidden",
  };
  const description = {
    display: "flex",
    justifyContent: "space-between",
  };
  const [disable, setDisable] = useState(true);
  const [category, setCategory] = useState([]);
  const [postProd, setPostProd] = useState({});
  const [postPerson, setPostPerson] = useState({});
  const [fileProduct, setFileProduct] = useState(null);
  const [filePerson, setFilePerson] = useState(null);
  const [person, setPerson] = useState([]);
  const [product, setProduct] = useState([]);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [updatingPerson, setUpdatingPerson] = useState(false);
  const [id, setId] = useState(null);
  const [refresh, setRefresh] = useState(new Date());
  useEffect(() => {
    console.log("RUN>>>");
    const test = Firebase.db.collection("test").doc("Test");
    test
      .get()
      .then((d) => {
        // console.log(d.data());
        //setPostProd({})
        //  setPostPerson({})
        setDisable(false);
      })
      .catch(() => {
        alert("No connection");
        window.location.reload(false);
      });

    let cat = Firebase.db.collection("category").doc("_CATEGORY");
    cat.get().then((d) => {
      setCategory(d.data().alco);
      //  console.log(d.data().alco);
    });

    Firebase.db
      .collection("person")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const p = doc.data();
          const obj = {
            id: doc.id,
            ...p,
          };
          setPerson(prev => [...prev, obj]);
        });
      });

    Firebase.db
      .collection("product")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const p = doc.data();
          const obj = {
            id: doc.id,
            ...p,
          };
          setProduct(prev => [...prev, obj])
        });
      });
      return () => {
        setProduct([]);
        setPerson([]);
      }
      
  }, [refresh]);
  //--------------------------------------------------------------------------
  const handleInputProd = (e) => {
    setPostProd({
      ...postProd,
      [e.target.name]: `${e.target.value ? e.target.value : ""}`,
    });
  };

  const handleInputPerson = (e) => {
    setPostPerson({
      ...postPerson,
      [e.target.name]: `${e.target.value ? e.target.value : ""}`,
    });
  };
  const findCategory = () => {
    const finder = category.find((el) => el.name === postProd.category);
    return finder;
  };
  const checkProduct = () =>
    // for PRODUCT
    fileProduct &&
    postProd.name &&
    postProd.description &&
    postProd.price &&
    postProd.category &&
    postProd.type &&
    postProd.owner;

  const checkPerson = () =>
    // for PERSON
    filePerson &&
    postPerson.name &&
    postPerson.about &&
    postPerson.phone &&
    postPerson.category;
  // -------PRODUCT----------------------------------------------------------------
  const postToProd = () => {
    if (checkProduct()) {
      const upload = Firebase.uploadImg(
        `product/${fileProduct.name}`,
        fileProduct
      );
      upload.then((data) =>
        Firebase.onCreate(
          { ...postProd, src: data.metadata.fullPath, date: new Date() },
          "product"
        ).then((d) => {
          let product = { id: d.id };
          Firebase.db
            .collection("person")
            .doc(postProd.owner)
            .get()
            .then((res) => {
              let person = Firebase.db.collection("person");
              person.doc(postProd.owner).update({
                products: [...res.data().products, product],
              });
              setRefresh(new Date());
            });
        })
      );
    }
  };
  const handleUpdateProd = (el) => {
    const personFind = person.find((e) => e.id === el.owner);
    const { id, ...elem } = el;
    setId(id);
    setPostProd({
      ...elem,
      date: new Date(),
      owner: personFind ? personFind.id : "",
    });
    setUpdatingProduct(true);
  };

  const updateToProd = () => {
    if (updatingProduct) {
      Firebase.db
        .collection("product")
        .doc(id)
        .update({
          ...postProd,
        })
        .then(() => {
          setUpdatingProduct(false);
          setRefresh(new Date());
        })
        .catch(() => alert("Something happen, nothing is changed!"));
    }
  };

  const deleteFromProd = (el) => {
    const storeRef = Firebase.storeRef.child(el.src);

    storeRef
      .delete()
      .then(() => {
        Firebase.db
          .collection("product")
          .doc(el.id)
          .delete()
          .then(() => {
            Firebase.db
              .collection("person")
              .doc(el.owner)
              .get()
              .then((res) => {
                const pChange = res
                  .data()
                  .products.filter((elem) => elem.id !== el.id);
                //console.log(pChange);
                let person = Firebase.db.collection("person");
                person.doc(el.owner).update({
                  products: [...pChange],
                });
                //window.location.reload(false);
              }).catch((e) =>{
                
              });
              setRefresh(new Date());
          });
      })
      .catch((e) => {
          alert(e.message)
          alert(`Image not exist! Data of ${el.id} will be deleted`);
          Firebase.db
            .collection("product")
            .doc(el.id)
            .delete()
            .then(() => {
              Firebase.db
                .collection("person")
                .doc(el.owner)
                .get()
                .then((res) => {
                  const pChange = res
                    .data()
                    .products.filter((elem) => elem.id !== el.id);
                  //console.log(pChange);
                  let person = Firebase.db.collection("person");
                  person.doc(el.owner).update({
                    products: [...pChange],
                  });
                  //window.location.reload(false);
                }).catch((e)=>{
                   alert("No owner!", e)
                });
                setRefresh(new Date());
            }).catch((e)=>{
               alert("Something happen, nothing is changed!", e)
            });
      });
  };
  // -------PRODUCT----------------------------------------------------------------

  // -------PERSON----------------------------------------------------------------
  const postToPerson = () => {
    if (checkPerson()) {
      const upload = Firebase.uploadImg(
        `person/${filePerson.name}`,
        filePerson
      );
      upload.then((data) =>
        Firebase.onCreate(
          {
            ...postPerson,
            src: data.metadata.fullPath,
            date: new Date(),
            products: [],
          },
          "person"
        ).then((d) => {
          //window.location.reload(false);
          setRefresh(new Date());
        })
      );
    }
  };

  const handleUpdatePerson = (el) => {
    const productFind = product.find((e) => e.id === el.products.id);
    const { id, ...elem } = el;
    setId(id);
    setPostPerson({
      ...elem,
      date: new Date(),
      // owner: [ ...productFind]
    });
    setUpdatingPerson(true);
    //console.log(productFind);
  };

  const updateToPerson = () => {
    if (updatingPerson) {
      Firebase.db
        .collection("person")
        .doc(id)
        .update({
          ...postPerson,
        })
        .then(() => {
          setUpdatingPerson(false);
          setRefresh(new Date());
        })
        .catch(() => alert("Something happen, nothing is changed!"));
    }
  };
  const deleteFromPerson = (el) => {
    const storeRef = Firebase.storeRef.child(el.src);

    storeRef
      .delete()
      .then(() => {
        Firebase.db
          .collection("person")
          .doc(el.id)
          .delete()
          .then(() => {
            // window.location.reload(false);
            setRefresh(new Date());
          });
      })
      .catch((e) => {
        //console.log(e.message);
          alert(e.message);
          alert(`Image not exist! Data of ${el.id} will be deleted`);
          Firebase.db
            .collection("person")
            .doc(el.id)
            .delete()
            .then(() => {
              setRefresh(new Date());
            }).catch((e)=>{
          alert("Something happen, nothing is changed!");
        })
      });
  };

  // -------PERSON----------------------------------------------------------------
  return (
    <div>
      <div style={!disable ? styleSc : displayNone}>
        <div
          style={
            checkProduct() ? style : !updatingProduct ? styleRed : styleGreen
          }
        >
          Create Product
          <div style={styleItem}>
            <input
              type="file"
              onChange={(e) => {
                setFileProduct(e.target.files[0]);
              }}
            ></input>

            <input
              name="name"
              placeholder="name"
              onChange={handleInputProd}
              value={postProd.name}
            ></input>

            <input
              name="name_ru"
              placeholder="name_ru"
              onChange={handleInputProd}
              value={postProd.name_ru}
            ></input>

            <input
              name="name_am"
              placeholder="name_am"
              onChange={handleInputProd}
              value={postProd.name_am}
            ></input>
          </div>
          <div style={style}>
            <div style={description}>
              <textarea
                name="description"
                placeholder="description"
                onChange={handleInputProd}
                style={textArea}
                value={postProd.description}
              ></textarea>

              <textarea
                name="description_ru"
                placeholder="description_ru"
                onChange={handleInputProd}
                style={textArea}
                value={postProd.description_ru}
              ></textarea>

              <textarea
                name="description_am"
                placeholder="description_am"
                onChange={handleInputProd}
                style={textArea}
                value={postProd.description_am}
              ></textarea>
            </div>

            <input
              name="price"
              placeholder="price"
              type="number"
              onChange={handleInputProd}
              style={styleB}
              value={postProd.price}
            ></input>

            <select
              name="category"
              onChange={(e) => {
                handleInputProd(e);
                findCategory();
              }}
              style={styleB}
              value={postProd.category}
            >
              <option label="Choose category"></option>
              {category.map((el, index) => (
                <option key={index}>{`${el.name}`}</option>
              ))}
            </select>

            {postProd.category && (
              <select
                name="type"
                onChange={handleInputProd}
                style={styleB}
                value={postProd.type}
              >
                <option label="Choose type"></option>
                {findCategory().type.map((el, index) => (
                  <option key={index}>{el}</option>
                ))}
              </select>
            )}

            {!updatingProduct && (
              <select name="owner" onChange={handleInputProd} style={styleB}>
                <option label="Choose owner"></option>
                {person.map((el, index) => (
                  <option key={index} label={el.name}>
                    {el.id}
                  </option>
                ))}
              </select>
            )}
            {!updatingProduct ? (
              <button style={styleB} onClick={postToProd}>
                Submit
              </button>
            ) : (
              <div>
                <button style={styleB} onClick={updateToProd}>
                  Update
                </button>
                <button
                  style={styleB}
                  onClick={() => {
                    setUpdatingProduct(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div style={{ fontSize: " 10px" }}>
            <table>
              <tbody>
                {/*
              <tr>
                <th>id</th>
                <th>name</th>
                <th>name_ru</th>
                <th>name_am</th>
                <th>description</th>
                <th>description_ru</th>
                <th>description_am</th>
                <th>price</th>
                <th>category</th>
              </tr> 
              */}
                {product.map((el) => (
                  <tr key={el.id}>
                    {Object.keys(el).map((key, index) => (
                      <td key={index}>
                        <div className="key">{`${key}`}</div>
                        <div
                          className="val"
                        >{`${el[key]}`}</div>
                      </td>
                    ))}
                    <td>
                      <button onClick={() => handleUpdateProd(el)}>
                        Update
                      </button>
                      <button onClick={() => deleteFromProd(el)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={
            checkPerson() ? style : !updatingPerson ? styleRed : styleGreen
          }
        >
          Create Person
          <div style={styleItem}>
            <input
              type="file"
              onChange={(e) => {
                setFilePerson(e.target.files[0]);
              }}
            ></input>

            <input
              name="name"
              placeholder="name"
              onChange={handleInputPerson}
              value={postPerson.name}
            ></input>

            <input
              name="name_ru"
              placeholder="name_ru"
              onChange={handleInputPerson}
              value={postPerson.name_ru}
            ></input>

            <input
              name="name_am"
              placeholder="name_am"
              onChange={handleInputPerson}
              value={postPerson.name_am}
            ></input>
          </div>
          <div style={style}>
            <div style={description}>
              <textarea
                name="about"
                placeholder="about"
                onChange={handleInputPerson}
                style={textArea}
                value={postPerson.about}
              ></textarea>

              <textarea
                name="about_ru"
                placeholder="about_ru"
                onChange={handleInputPerson}
                style={textArea}
                value={postPerson.about_ru}
              ></textarea>

              <textarea
                name="about_am"
                placeholder="about_am"
                onChange={handleInputPerson}
                style={textArea}
                value={postPerson.about_am}
              ></textarea>
            </div>
            <div>
              <input
                name="phone"
                placeholder="phone"
                onChange={handleInputPerson}
                style={styleB}
                value={postPerson.phone}
              ></input>
              <input
                name="phone1"
                placeholder="phone1"
                onChange={handleInputPerson}
                style={styleB}
                value={postPerson.phone1}
              ></input>
            </div>

            <input
              name="category"
              placeholder="category"
              onChange={handleInputPerson}
              style={styleB}
              value={postPerson.category}
            ></input>

            {!updatingPerson ? (
              <button style={styleB} onClick={postToPerson}>
                Submit
              </button>
            ) : (
              <div>
                <button style={styleB} onClick={updateToPerson}>
                  Update
                </button>
                <button
                  style={styleB}
                  onClick={() => {
                    setUpdatingPerson(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div style={{ fontSize: " 10px" }}>
            <table>
              <tbody>
                {/*
              <tr>
                <th>id</th>
                <th>name</th>
                <th>name_ru</th>
                <th>name_am</th>
                <th>about</th>
                <th>about_ru</th>
                <th>about_am</th>
                <th>phone</th>
                <th>phone1</th>
                <th>category</th>
              </tr>
              */}
                {person.map((el) => (
                  <tr key={el.id}>
                    {Object.keys(el).map((key, index) => (
                      <td key={index}>
                        <div className="key">{`${key}`}</div>
                        <div
                          className="val"
                        >{`${el[key]}`}</div>
                      </td>
                    ))}
                    <td>
                      <button onClick={() => handleUpdatePerson(el)}>
                        Update
                      </button>
                      <button onClick={() => deleteFromPerson(el)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {
        //<div style = {styleItem}>{refresh.toString()}</div>
      }
    </div>
  );
}
