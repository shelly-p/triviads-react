import { useState, useEffect } from "react";
import { db, registerUser, collection, getDocs, query, where, onAuthStateChanged, auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
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



  const handleEmailChange = async (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);

    const q = query(collection(db, "users"), where("email", "==", emailValue));
    const querySnapshot = await getDocs(q);
    setEmailExists(!querySnapshot.empty);
  };

  const handleUsernameChange = async (event) => {
    const usernameValue = event.target.value;
    setUsername(usernameValue);

    const q = query(collection(db, "users"), where("username", "==", usernameValue));
    const querySnapshot = await getDocs(q);
    setUsernameExists(!querySnapshot.empty);
  };

  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!emailExists && !usernameExists) {
      registerUser(email, password, username);
      navigate("/Dashboard");
    }
  };

  return (
    <div 
    className="p-5">
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
              <h1>Sign Up</h1>
              <div>Please sign up to use the platform</div>
              {emailExists && <p>Email already exists</p>}
              {usernameExists && <p>Username already exists</p>}
            </div>

            <form className="login-card-form" onSubmit={handleSubmit}>
              <div className="form-item">

                <span className="form-item-icon material-symbols-rounded">mail</span>
                <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} autofocus required />
              </div>
              <div className="form-item">
                <span className="form-item-icon material-symbols-rounded">badge</span>
                <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} autofocus required />
              </div>
              <div className="form-item">
                <span className="form-item-icon material-symbols-rounded">lock</span>
                <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} autofocus required />
              </div>

              <button type="submit" disabled={emailExists || usernameExists}>Sign Up</button>
            </form>
            <div className="login-card-footer">
              Have an account? <Link to="/Login">Please Login.</Link>
            </div>
          </div>
      
          
        </div>
      )}
    </div>
  );
};

export default Register;