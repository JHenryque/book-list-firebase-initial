import FullPageLoader from "../components/FullPageLoader.jsx";
import { useState } from "react";
import { auth } from "../firebase/config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/usersSlice.js";

function LoginPage() {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [loginType, setLoginType] = useState("login");
  const [userCredentials, setUserCredentials] = useState({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        setUser({
          id: user.uid,
          email: user.email,
        })
      );
    } else {
      dispatch(setUser(null));
    }
    if (isLoading) {
      setIsLoading(false);
    }
  });

  function ErroCampoObrigatorio() {
    if (!userCredentials.email || !userCredentials.password) {
      setError("Email and password are required");
      return;
    }
  }

  function handleCredentials(e) {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  }

  function handleSignup(e) {
    e.preventDefault();

    ErroCampoObrigatorio();
    setError("");
    createUserWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    ).catch((error) => {
      const errorMessage = error.message;
      if (error.code == "auth/missing-password") {
        return setError("Password is required");
      }

      if (error.code == "auth/invalid-email") {
        return setError("Email is invalid");
      }

      console.log("mensagem de erro: " + errorMessage);
    });
  }

  function handleLogin(e) {
    e.preventDefault();

    ErroCampoObrigatorio();
    signInWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    ).catch((error) => {
      const errorMessage = error.message;
      if (error.code == "auth/invalid-credential") {
        return setError("Password is required");
      }

      if (error.code == "auth/invalid-email") {
        return setError("Email is invalid");
      }

      console.log("mensagem de erro: " + errorMessage);
    });
  }

  function handleResetPassword() {
    const email = prompt("Please enter your email");
    if (email) {
      sendPasswordResetEmail(auth, email);
      alert("Email sent! Check your inbox for password reset instructions.");
      return;
    }
  }

  return (
    <>
      {isLoading && <FullPageLoader></FullPageLoader>}

      <div className="container login-page">
        <section>
          <h1>Welcome to the Book App</h1>
          <p>Login or create an account to continue</p>
          <div className="login-type">
            <button
              className={`btn ${loginType == "login" ? "selected" : ""}`}
              onClick={() => setLoginType("login")}
            >
              Login
            </button>
            <button
              className={`btn ${loginType == "signup" ? "selected" : ""}`}
              onClick={() => setLoginType("signup")}
            >
              Signup
            </button>
          </div>
          <form className="add-form login">
            <div className="form-control">
              <label>Email *</label>
              <input
                type="text"
                name="email"
                onChange={(e) => {
                  handleCredentials(e);
                }}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-control">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                onChange={(e) => {
                  handleCredentials(e);
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={(e) => {
                loginType == "login" ? handleLogin(e) : handleSignup(e);
              }}
              className="active btn btn-block"
            >
              {loginType == "login" ? "Login" : "Sign Up"}
            </button>
            <div className="error">{error}</div>
            <p onClick={handleResetPassword} className="forgot-password">
              Forgot Password?
            </p>
          </form>
        </section>
      </div>
    </>
  );
}

export default LoginPage;
