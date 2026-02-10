import { signInWithPopup } from "firebase/auth";
import { auth, provider } from './fireBase.js';
import api from "./axios.jsx";



const handleGoogleLogin = async (navigate, login) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const firebaseToken = await user.getIdToken();
    const response = await api.post("http://localhost:5000/auth/firebase", {
      token: firebaseToken
    });
    if (response.data?.data?.accessToken) {
      login(response.data.data.accessToken);
      navigate("/dashboard");
    } else {
      console.error("No access token received from backend");
      alert("Login failed: No access token received");
    }

  } catch (error) {
    console.error(error);
    if (error.code === 'auth/popup-blocked') {
      alert("Popup blocked! Please allow popups for this site in your browser settings.");
    } else {
      alert(error.message);
    }
  }
};
export default handleGoogleLogin;