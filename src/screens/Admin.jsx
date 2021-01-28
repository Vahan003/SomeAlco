import React, { useState, useEffect } from "react";
import Firebase from "../firebase/firebase";
import { useHistory } from "react-router-dom";
import "../styles/admin.styles.css";
export default function Admin(props) {
  const [disable, setDisable] = useState(true);
  const [category, setCategory] = useState([]);
  const [postCategory, setPostCategory] = useState({});
  const [postProd, setPostProd] = useState({});
  const [postPerson, setPostPerson] = useState({});
  const [fileProduct, setFileProduct] = useState(null);
  const [filePerson, setFilePerson] = useState(null);
  const [person, setPerson] = useState([]);
  const [product, setProduct] = useState([]);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [updatingPerson, setUpdatingPerson] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [id, setId] = useState(null);
  const [refresh, setRefresh] = useState(new Date());
  const [auth, setAuth] = useState("");
  const history = useHistory();

  useEffect(() => {
    console.log("RUN>>>");
    async function authWithGoogle() {
      if (!localStorage.getItem("AUTH_TOKEN")) {
        const _auth = await Firebase.authGoogle();
        localStorage.setItem("AUTH_TOKEN", _auth);
        setAuth(_auth);
      } else {
        setAuth(localStorage.getItem("AUTH_TOKEN"));
      }
    }
    authWithGoogle();
    const test = Firebase.db.collection("test").doc("Test");
    test
      .get()
      .then((d) => {
        // console.log(d.data());
        setDisable(false);
      })
      .catch(() => {
        alert("No connection");
        window.location.reload(false);
      });

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
      .collection("person")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const p = doc.data();
          const obj = {
            id: doc.id,
            ...p,
          };
          setPerson((prev) => [...prev, obj]);
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
          setProduct((prev) => [...prev, obj]);
        });
      });
    return () => {
      setProduct([]);
      setPerson([]);
      setCategory([]);
    };
  }, [refresh]);

  const exit = async () => {
    Firebase.authGoogleSignOut();
    localStorage.removeItem("AUTH_TOKEN");
    alert("Admin, sign-out successful");
    history.push("/");
  };
  //--------------------------------------------------------------------------
  const handleInputProd = (e) => {
    e.persist();
    setPostProd({
      ...postProd,
      [e.target.name]: `${e.target.value ? e.target.value : ""}`,
    });
  };

  const handleInputPerson = (e) => {
    e.persist();
    setPostPerson({
      ...postPerson,
      [e.target.name]: `${e.target.value ? e.target.value : ""}`,
    });
  };

  const handleInputCategory = (e) => {
    e.persist();
      setPostCategory((prev) => ({
        ...prev,
        [e.target.name]: `${e.target.value ?? ""}`,
      }));
  };
  const handleInputType = (e) => {
    e.persist();
      const typeArr = e.target.value.split(",");
      const typeArrTrim = typeArr.map(el => el.trim())
      setPostCategory((prev) => ({
        ...prev,
        [e.target.name]: typeArrTrim,
      }));
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
              setPostProd((prev) => ({}));
            });
        })
      );
    }
  };
  const handleUpdateProd = (el) => {
    const personFind = person.find((e) => e.id === el.owner);
    const { id, ...elem } = el;
    setId(id);
    setPostProd((prev) => ({
      ...elem,
      date: new Date(),
      owner: personFind ? personFind.id : "",
    }));
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
          setPostProd((prev) => ({}));
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
              })
              .catch((e) => {});
            setRefresh(new Date());
          });
      })
      .catch((e) => {
        alert(e.message);
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
              })
              .catch((e) => {
                alert("No owner!", e);
              });
            setRefresh(new Date());
          })
          .catch((e) => {
            alert("Something happen, nothing is changed!", e);
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
          setRefresh(new Date());
          setPostPerson((prev) => ({}));
        })
      );
    }
  };

  const handleUpdatePerson = (el) => {
    //const productFind = product.find((e) => e.id === el.products.id);
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
          setPostPerson((prev) => ({}));
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
            setRefresh(new Date());
          });
      })
      .catch((e) => {
        alert(e.message);
        alert(`Image not exist! Data of ${el.id} will be deleted`);
        Firebase.db
          .collection("person")
          .doc(el.id)
          .delete()
          .then(() => {
            setRefresh(new Date());
          })
          .catch((e) => {
            alert("Something happen, nothing is changed!");
          });
      });
  };
  // -------PERSON---------------------------------------------------------------
  // -------CATEGORY-------------------------------------------------------------
  const postToCategory = () => {
    Firebase.onCreate(
      {
        ...postCategory,
        date: new Date(),
      },
      "category"
    ).then(() => {
      setRefresh(new Date());
      setPostCategory((prev) => ({}));
    });
  };
  const handleUpdateCategory = (el) => {
    const { id, ...elem } = el;
    setId(id);
    setPostCategory((prev) => ({
      ...elem,
    }));
    setUpdatingCategory(true);
  };
  const updateToCategory = () => {
    Firebase.db
      .collection("category")
      .doc(id)
      .update({
        ...postCategory,
      })
      .then(() => {
        setRefresh(new Date());
        setPostCategory((prev) => ({}));
        setUpdatingCategory(false);
      })
      .catch(() => alert("Something happen, nothing is changed!"));
  };
  const deleteFromCategory = (el) => {
    Firebase.db
          .collection("category")
          .doc(el.id)
          .delete()
          .then(() => {
            setRefresh(new Date());
          });
  }
  const findCategory = () => {
    const finder = category.find((el) => `${el.id}` === postProd.category);
    return finder;
  };
  // -------CATEGORY-------------------------------------------------------------
  const orderObectKeys = (obj) => {
    const ordered = {};
    Object.keys(obj)
      .sort()
      .forEach(function (key) {
        ordered[key] = obj[key];
      });
    return ordered;
  };
  const detEmpty = (val) => {
    return val ? val : "";
  };
  return (
    <>
      {auth && (
        <div className={!disable ? "styleSc" : "displayNone"}>
          <button onClick={() => exit()} style={{ position: "fixed" }}>
            Exit
          </button>
          <div
            className={
              checkProduct()
                ? "style"
                : !updatingProduct
                ? "styleRed"
                : "styleGreen"
            }
          >
            <div>Create Product</div>
            <div className={"styleItem"}>
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
                value={detEmpty(postProd.name)}
              ></input>

              <input
                name="name_ru"
                placeholder="name_ru"
                onChange={handleInputProd}
                value={detEmpty(postProd.name_ru)}
              ></input>

              <input
                name="name_am"
                placeholder="name_am"
                onChange={handleInputProd}
                value={detEmpty(postProd.name_am)}
              ></input>
            </div>
            <div className={"inSec"}>
              <div className={"description"}>
                <textarea
                  name="description"
                  placeholder="description"
                  onChange={handleInputProd}
                  className={"textArea"}
                  value={detEmpty(postProd.description)}
                ></textarea>

                <textarea
                  name="description_ru"
                  placeholder="description_ru"
                  onChange={handleInputProd}
                  className={"textArea"}
                  value={detEmpty(postProd.description_ru)}
                ></textarea>

                <textarea
                  name="description_am"
                  placeholder="description_am"
                  onChange={handleInputProd}
                  className={"textArea"}
                  value={detEmpty(postProd.description_am)}
                ></textarea>
              </div>

              <input
                name="price"
                placeholder="price"
                type="number"
                onChange={handleInputProd}
                className={"styleB"}
                value={detEmpty(postProd.price)}
              ></input>

              <select
                name="category"
                onChange={(e) => {
                  handleInputProd(e);
                  findCategory();
                }}
                className={"styleB"}
                value={detEmpty(postProd.category)}
              >
                <option label="Choose category"></option>
                {category.map((el, index) => (
                  <option key={index} label = {`${el.name}`}>{`${el.id}`}</option>
                ))}
              </select>

              {postProd.category && (
                <select
                  name="type"
                  onChange={handleInputProd}
                  className={"styleB"}
                  value={detEmpty(postProd.type)}
                >
                  <option label="Choose type"></option>
                  {findCategory()?.type?.map((el, index) => (
                    <option key={index}>{el}</option>
                  ))}
                </select>
              )}

              {!updatingProduct && (
                <select
                  name="owner"
                  onChange={handleInputProd}
                  className={"styleB"}
                >
                  <option label="Choose owner"></option>
                  {person.map((el, index) => (
                    <option key={index} label={el.name}>
                      {el.id}
                    </option>
                  ))}
                </select>
              )}
              {!updatingProduct ? (
                <button className={"styleButton"} onClick={postToProd}>
                  Submit
                </button>
              ) : (
                <div>
                  <button className={"styleButton"} onClick={updateToProd}>
                    Update
                  </button>
                  <button
                    className={"styleButton"}
                    onClick={() => {
                      setUpdatingProduct(false);
                      setPostProd((prev) => ({}));
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: " 10px" }}>
              <table className="blueTable">
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
                      {Object.keys(orderObectKeys(el)).map((key, index) => (
                        <td key={index}>
                          <div className="keyTd">{`${key}`}</div>
                          <div className="valTd">{`${el[key]}`}</div>
                        </td>
                      ))}
                      <td>
                        <button
                          onClick={() => handleUpdateProd(el)}
                          className={"styleButton"}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteFromProd(el)}
                          className={"styleButton"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className={
              checkPerson()
                ? "style"
                : !updatingPerson
                ? "styleRed"
                : "styleGreen"
            }
          >
            <div>Create Person</div>
            <div className={"styleItem"}>
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
                value={detEmpty(postPerson.name)}
              ></input>

              <input
                name="name_ru"
                placeholder="name_ru"
                onChange={handleInputPerson}
                value={detEmpty(postPerson.name_ru)}
              ></input>

              <input
                name="name_am"
                placeholder="name_am"
                onChange={handleInputPerson}
                value={detEmpty(postPerson.name_am)}
              ></input>
            </div>
            <div className={"inSec"}>
              <div className={"description"}>
                <textarea
                  name="about"
                  placeholder="about"
                  onChange={handleInputPerson}
                  className={"textArea"}
                  value={detEmpty(postPerson.about)}
                ></textarea>

                <textarea
                  name="about_ru"
                  placeholder="about_ru"
                  onChange={handleInputPerson}
                  className={"textArea"}
                  value={detEmpty(postPerson.about_ru)}
                ></textarea>

                <textarea
                  name="about_am"
                  placeholder="about_am"
                  onChange={handleInputPerson}
                  className={"textArea"}
                  value={detEmpty(postPerson.about_am)}
                ></textarea>
              </div>
              <div>
                <input
                  name="phone"
                  placeholder="phone"
                  onChange={handleInputPerson}
                  className={"styleB"}
                  value={detEmpty(postPerson.phone)}
                ></input>
                <input
                  name="phone1"
                  placeholder="phone1"
                  onChange={handleInputPerson}
                  className={"styleB"}
                  value={detEmpty(postPerson.phone1)}
                ></input>
              </div>

              <input
                name="category"
                placeholder="category"
                onChange={handleInputPerson}
                className={"styleB"}
                value={detEmpty(postPerson.category)}
              ></input>

              {!updatingPerson ? (
                <button className={"styleButton"} onClick={postToPerson}>
                  Submit
                </button>
              ) : (
                <div>
                  <button className={"styleButton"} onClick={updateToPerson}>
                    Update
                  </button>
                  <button
                    className={"styleButton"}
                    onClick={() => {
                      setUpdatingPerson(false);
                      setPostPerson((prev) => ({}));
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: " 10px" }}>
              <table className="blueTable">
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
                      {Object.keys(orderObectKeys(el)).map((key, index) => (
                        <td key={index}>
                          <div className="keyTd">{`${key}`}</div>
                          <div className="valTd">{`${el[key]}`}</div>
                        </td>
                      ))}
                      <td>
                        <button
                          onClick={() => handleUpdatePerson(el)}
                          className={"styleButton"}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteFromPerson(el)}
                          className={"styleButton"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="style">
            <div>Create Category</div>
            <div className="inSec">
              <div className="input0">
                <input
                  className="input1"
                  name="name"
                  placeholder="name"
                  onChange={handleInputCategory}
                  value={detEmpty(postCategory.name)}
                />
                <input
                  className="input2"
                  name="type"
                  placeholder="type"
                  onChange={handleInputType}
                  value={postCategory.type?.join(",") ?? ""}
                />
              </div>
              <div className="input0">
                <input
                  className="input1"
                  name="name_ru"
                  placeholder="name_ru"
                  onChange={handleInputCategory}
                  value={detEmpty(postCategory.name_ru)}
                />
                <input
                  className="input2"
                  name="type_ru"
                  placeholder="type_ru"
                  onChange={handleInputType}
                  value={postCategory.type_ru?.join(",") ?? ""}
                />
              </div>
              <div className="input0">
                <input
                  className="input1"
                  name="name_am"
                  placeholder="name_am"
                  onChange={handleInputCategory}
                  value={detEmpty(postCategory.name_am)}
                />
                <input
                  className="input2"
                  name="type_am"
                  placeholder="type_am"
                  onChange={handleInputType}
                  value={postCategory.type_am?.join(",") ?? ""}
                />
              </div>
              {
                !updatingCategory ? (
                <button className="styleButton" onClick={postToCategory}>
                  Submit
                </button>
              ) : (
                <div>
                  <button className={"styleButton"} onClick={updateToCategory}>
                    Update
                  </button>
                  <button
                    className={"styleButton"}
                    onClick={() => {
                      setUpdatingCategory(false);
                      setPostCategory((prev) => ({}));
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            {category.map((el, index) => (
              <div key={index} className="inputCat">
              <div className = "keyTd">
                {`[ ${el.id} ] ${el.name ?? ""} --- ${el.name_ru ?? ""} --- ${
                  el.name_am ?? ""
                }`}
                </div>
                <div className="types">
                  {el.type?.map((e, index) => (
                    <span key={index}>{` ${e}--`}</span>
                  ))}
                </div>

                <div className="types">
                  {el.type_ru?.map((e, index) => (
                    <span key={index}>{` ${e}--`}</span>
                  ))}
                </div>
                <div className="types">
                  {el.type_am?.map((e, index) => (
                    <span key={index}>{` ${e}--`}</span>
                  ))}
                </div>
                <div>
                  <button
                    onClick={() => handleUpdateCategory(el)}
                    className={"styleButton"}
                  >
                    Update
                  </button>
                  <button onClick={() => deleteFromCategory(el)} className={"styleButton"}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* <div 
        className = {"styleItem"}>{refresh.toString()}
        </div> */}
    </>
  );
}
