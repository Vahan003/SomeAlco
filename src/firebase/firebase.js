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


onCreate= async (data={}, collectionName= this.defCollection) => 
  this.db.collection(collectionName).add(data)
}
export default new Firebase()