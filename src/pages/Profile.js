import { useState, useEffect } from "react";
import { db, query, doc, getDoc, onAuthStateChanged, collection, where, getDocs, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(JSON.parse(localStorage.getItem('authenticatedUser')) || null);
  const [pointsTotal, setPointsTotal] = useState(null);
  const [gamesCreated, setGamesCreated] = useState(null);
  const navigate = useNavigate();

  // Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);
      } else {
        setAuthenticatedUser(null);
        
      }
    });
    return unsubscribe;
  }, []);

  // Getting user's email and username
  useEffect(() => {
    const fetchEmailAndUsername = async () => {
      if (authenticatedUser) {
        try {
          const docRef = doc(db, "users", authenticatedUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEmail(docSnap.data().email);
            setUsername(docSnap.data().username);
          } else {
            setEmail(null);
            setUsername(null);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchEmailAndUsername();
  }, [authenticatedUser]);

  // Getting users total points
  useEffect(() => {
    const fetchPoints = async () => {
        if (authenticatedUser) {
            try {
                const leaderboardRef = collection(db, "leaderboard");
                const q = query(leaderboardRef, where("email", "==", authenticatedUser.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setPointsTotal(doc.data().pointsTotal);
                });
            } catch (error) {
                console.log(error);
            }
        }
    };
    fetchPoints();
}, [authenticatedUser]);

  //Getting the amount of times the user has created a game
  useEffect(() => {
    const fetchGamesCreated = async () => {
      if (authenticatedUser) {
        try {
          const q = query(collection(db, "GameId"), where("createdBy", "==", email))
          const querySnapshot = await getDocs(q);
          setGamesCreated(querySnapshot.size);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchGamesCreated();
  }, [authenticatedUser, email]);

  return (
    <>
    {authenticatedUser ? (
      <>
        <div className="text-center text-light p-5">
          <h2 className="display-4 p-3">Profile</h2>
          <hr></hr>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profile</h5>
              <p className="p-2 display-6">Email: {email}</p>
              <p className="p-2 display-6">Username: {username}</p>
              <p className="p-2 display-6"> Total Points: {pointsTotal}</p>
              <p className="p-2 display-6">Games Created: {gamesCreated}</p>
            </div>
          </div>
        </div>
      </>
    ) : (
      <>{navigate("/Home")};</>
    )}
    ;
  </>
  );
}

export default Profile;

