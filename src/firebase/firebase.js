import * as firebase from "firebase"
import app from 'firebase/app';
import 'firebase/auth'; // authentication
import 'firebase/firestore';
import 'firebase/storage'
import firebaseConfig from './config';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.storeRef = app.storage().ref()
    this.db = app.firestore();
    this.defCollection = "";
  }


uploadImg = async (path, file) => {
  const fileData = new Blob([file], {type : 'image/jpeg'})
  const date = new Date()
  const data = new FormData()
  data.append("blob",fileData,`IMG_${date.getTime()}_${file.name}`)
  const storeRef = this.storeRef.child(path)
  
  return await storeRef.put(data.get("blob"))
}
authGoogle = async () => {
  let _token = "";
  const provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().signInWithPopup(provider)
  .then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    _token = result.credential.accessToken; 
    // The signed-in user info.
    //const user = result.user;
    // ...
  })
  .catch(function(error) {
    // Handle Errors here.
    //const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
    // The email of the user's account used.
    //const email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    //const credential = error.credential;
    // ...
  });
  return _token
}
authGoogleSignOut = async () => {
 await firebase.auth().signOut().then(function() {

 }).catch(function(error) {
   alert(error)
 });
}

onCreate= async (data={}, collectionName= this.defCollection) => 
  this.db.collection(collectionName).add(data)
}
export default new Firebase()