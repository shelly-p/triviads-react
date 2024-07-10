import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  authenticateUser,
  onAuthStateChanged,
  signInWithGoogle,
} from "../firebase";

const Login = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);
      } else {
        setAuthenticatedUser(null);
      }
    });
    return unsubscribe;
  }, [auth]);

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateUser(emailRef.current.value, passwordRef.current.value);

  };

  return (
    <div className="p-5">
      {authenticatedUser ? (
        <>
          <p>User is logged in</p>
          {navigate("/Dashboard")}
        </>
      ) : (
        <div className="login-card-container">
          <div className="login-card">
            <div className="login-card-logo">
              <span className="material-symbols-rounded display-3">
                psychology
              </span>
            </div>
            <div className="login-card-header">
              <h1>Login</h1>
              <div>Please sign up to use the platform</div>
            </div>

            <form className="login-card-form" onSubmit={handleSubmit}>
              <div className="form-item">
                <span className="form-item-icon material-symbols-rounded">
                  mail
                </span>
                <input
                  type="email"
                  ref={emailRef}
                  placeholder="Email"
                  autoFocus
                  required
                />
              </div>
              <div className="form-item">
                <span className="form-item-icon material-symbols-rounded">
                  lock
                </span>
                <input
                  type="password"
                  ref={passwordRef}
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit">Sign In</button>
            </form>
            <div className="login-card-footer">
              Don't have an account? <Link to="/Register">Please Sign-Up.</Link>
            </div>
          </div>
          <div className="login-card-social">
            <div>Other Sign-In Options</div>
            <div className="login-card-social-btns">
              <a onClick={signInWithGoogle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-brand-google"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;