  import { signInWithPopup } from  "firebase/auth";
  import { auth, provider } from './fireBase.js';
  import axios from 'axios';

  
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const firebaseToken = await user.getIdToken();
    const response = await axios.post("http://localhost:5000/auth/firebase",{
        token:firebaseToken
    });
    console.log(response.data);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
export default handleGoogleLogin;