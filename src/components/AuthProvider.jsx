import { createContext, useEffect, useState } from "react";
import { app } from "./Firebase.Config";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  RecaptchaVerifier,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import useAxiosPublic from "./useAxiosPublic";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  // Signup with Email and Password
  const emailSignUp = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update User's Display Name
  const updateName = (displayName) => {
    setLoading(true);
    return updateProfile(auth.currentUser, { displayName });
  };

  // Email verification
  const emailVerification = (loggedUser) => {
    setLoading(true);
    return sendEmailVerification(loggedUser);
  };

  // Signin with Email and Password
  const emailSignIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Signup with Google
  const googleSignUp = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Signup with Facebook
  const facebookSignUp = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookProvider);
  };

  // Logout
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Password Reset Email
  const passwordResetEmail = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // Phone Number Authentication
  const onPhoneSignUp = async (phoneNumber) => {
    setLoading(true);
    const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {});
    return signInWithPhoneNumber(auth, phoneNumber, recaptcha);
  };

  // Track User Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // console.log("Current User Information inside AuthProvider", currentUser);

      if (currentUser) {
        // Store token to cookies
        await axiosPublic.post("/jwt", { email: currentUser?.email || user?.email })
        .then(() => {
          // console.log("Token Store To Cookies:", res?.data);
          setUser(currentUser);
          setLoading(false);
        });
      } else {
        // Remove token form cookies
        await axiosPublic
          .post("/logout", { email: currentUser?.email || user?.email })
          .then(() => {
            // console.log(res?.data?.message || "Logged Out!");
            setUser(null);
            setLoading(false);
          })
          .catch((error) => {
            if (error?.status === 401) {
              // console.log(".");
              setLoading(false);
            }
          });
      }
    });

    return () => {
      unsubscribe();
    };
  // }, [axiosPublic, user]);
  }, []);

  const authInfo = {
    user,
    loading,
    emailSignUp,
    updateName,
    emailVerification,
    emailSignIn,
    googleSignUp,
    passwordResetEmail,
    facebookSignUp,
    onPhoneSignUp,
    logout,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
