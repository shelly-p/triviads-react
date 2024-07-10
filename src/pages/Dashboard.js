import { useState, useEffect, useRef } from "react";
import { addGame, db, doc, getDoc, getDocs, auth, 
  onAuthStateChanged, collection, addDoc, 
  query, where, limit, updateDoc } from "../firebase";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const accessCodeRef = useRef();
  const gameInfo = useRef([]);
  const invalidCodeMsg = useRef();
  const newPlayerName = localStorage.getItem("username");

  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  
  const [role, setRole] = useState("player");
  const [isCodeVerified, setIsCodeVerified] = useState(null);
  const [isCreatedByCurrentUser, setIsCreatedByCurrentUser] = useState(false);
  
  const [category, setCategory] = useState('history');
  const [numOfQuestions, setNumOfQuestions] = useState(10);
  const [gameCode, setGameCode] = useState(null);
  const [activeView, setActiveView] = useState(null);

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

  useEffect(() => {
    const fetchEmail = async () => {
      if (authenticatedUser) {
        try {
          const docRef = doc(db, "users", authenticatedUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEmail(docSnap.data().email);
            //console.log(email);
          } else {
            setEmail(null);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchEmail();
  }, [authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser && email === gameInfo.current.createdBy) {
      setIsCreatedByCurrentUser(true);
      setRole("host");
    }
  }, [authenticatedUser, email]);




  const getCode = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'GameId', accessCodeRef.current.value)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      gameInfo.current = docSnap.data();
      console.log(gameInfo.current);
      localStorage.setItem("gameInfo", JSON.stringify(gameInfo.current));
      handleAddPlayer();
      setIsCodeVerified(true);
      invalidCodeMsg.current = "Code valid.";
    } else {
      setIsCodeVerified(false);
      console.log("No such document!");
    }
  }


  const handleAddPlayer = async () => {
    // Check if player already exists
    const existingPlayerQuery = query(collection(db, "players"), where("gameID", "==", gameInfo.current.access), where("name", "==", newPlayerName));
    const existingPlayerSnapshot = await getDocs(existingPlayerQuery);

    if (!existingPlayerSnapshot.empty) {
      const docId = existingPlayerSnapshot.docs[0].id;
      console.log("player name: ", localStorage.getItem("username"))
      console.log("Existing player found with ID:", docId);
      localStorage.setItem("docId", docId);

      // Update the points of the existing player to zero
      const playerRef = doc(collection(db, "players", docId));
      await updateDoc(playerRef, { points: 0 });

      return;
    }

    // Add new player
    const playerRef = collection(db, "players");
    const newPlayerDoc = await addDoc(playerRef, {
      name: newPlayerName,
      gameID: gameInfo.current.access,
      points: 0,
      role: role
    });
    const docId = newPlayerDoc.id;
    console.log("player name: ", localStorage.getItem("username"))
    console.log("New player added with ID:", docId);
    localStorage.setItem("docId", docId);
  };

  const handleCreateGame = async () => {
    // Access the questions collection to get the desired number of questions for the selected category
    const questionsQuery = query(collection(db, "questions"), where("category", "==", category), limit(numOfQuestions));
    const questionsSnapshot = await getDocs(questionsQuery);

    // Map the query results to an array of question objects
    const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Call the addGame function to add a new game to Firebase
    const accessCode = await addGame(category, numOfQuestions, 'user@example.com');

    // Update the state to display the access code
    setGameCode(accessCode);

    // Save the selected category and number of questions in local storage
    localStorage.setItem("category", category);
    localStorage.setItem("numOfQuestions", numOfQuestions);

    // Save the questions in local storage
    localStorage.setItem("questions", JSON.stringify(questions));
  };

  


  const handleNumOfQuestionsChange = (e) => {
    setNumOfQuestions(parseInt(e.target.value));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleButtonClick = (view) => {
    setActiveView(view);
  };

  const handleBack = () => {
    setActiveView(null);
  };


  const renderSoloPlayerOptions = () => {
    if (activeView !== 'soloPlayer') return null;
    return (
      <>
      <div>
        <label>
          <h5>Category:</h5>
          
          <select
            className="form-select"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value={"history"}>history</option>
            <option value={"arts & literature"}>arts & literature</option>
            <option value={"entertainment"}>entertainment</option>
            <option value={"geography"}>geography</option>
            <option value={"mythology & folklore"}>
              mythology & folklore
            </option>
            <option value={"religion"}>religion</option>
            <option value={"science"}>science</option>
            <option value={"sports"}>sports</option>
          </select>
          </label>
        <br />
        <label>
          <h5>Number of questions:</h5>
          
          <select
            className="form-select"
            value={numOfQuestions}
            onChange={handleNumOfQuestionsChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          </label>
        <br />
        <div className="display-1">
          <div className="row align-items-center">
            <div className="col">
              <button className="btn btn-dark " onClick={handleCreateGame}>
                Create Game
              </button>
              <span> </span>
              <button
                className="btn btn-dark "
                onClick={() => handleButtonClick("joinMultiplayer")}
              >
                Join game
              </button>

              {gameCode && <p>Game code: {gameCode}</p>}

              {activeView === "joinMultiplayer" &&
                renderJoinMultiplayerOptions()}
            </div>
          </div>
        </div>
      </div>
    </>
    );
  };

  const renderMultiplayerOptions = () => {
    if (activeView !== 'multiplayer') return null;
    return (
      <>
      <div>
        <label>
          <h5>Category:</h5>
          <select
            className="form-select"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value={"history"}>history</option>
            <option value={"arts & literature"}>arts & literature</option>
            <option value={"entertainment"}>entertainment</option>
            <option value={"geography"}>geography</option>
            <option value={"mythology & folklore"}>
              mythology & folklore
            </option>
            <option value={"religion"}>religion</option>
            <option value={"science"}>science</option>
            <option value={"sports"}>sports</option>
          </select>
        </label>
        <br />
        <label>
          <h5> Number of questions:</h5>
          <select
            className="form-select"
            value={numOfQuestions}
            onChange={handleNumOfQuestionsChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
        <br />
        <div className="display-1">
          <div className="row align-items-center">
            <div className="col">
              <button className="btn btn-dark " onClick={handleCreateGame}>
                Create Game
              </button>
              <span> </span>
              <button
                className="btn btn-dark "
                onClick={() => handleButtonClick("joinMultiplayer")}
              >
                Join game
              </button>

              {gameCode && <p>Game code: {gameCode}</p>}

              {activeView === "joinMultiplayer" &&
                renderJoinMultiplayerOptions()}
            </div>
          </div>
        </div>
      </div>
    </>
    );
  };

  const renderJoinMultiplayerOptions = () => {
    if (activeView !== 'joinMultiplayer') return null;
    return (
      <>
        <form onSubmit={getCode}>
          <h3>Join game</h3>
          <label>
            <h5>Access code:</h5>
          </label>
          <br />
          <input type="text" ref={accessCodeRef} />
          <br />
          <br />
          <button className="btn btn-dark" type="submit">
            Verify code
          </button>
        </form>
        {isCodeVerified ? (
          <>
            <p>Code is verified.</p>
            <button className="btn btn-dark "
            onClick={() => navigate("/WaitingRoom")}>Join</button>
          </>
        ) : (
          <>
            <p>Invalid code.</p>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {authenticatedUser ? (
        <>
          <div className="container-lg text-light p-5 ">
            <div className="row justify-content-center">
              <div className="col text-center">
                <h1 className="display-3">Dashboard</h1>
                {activeView === null && (
                  <>
                    <div className="row p-5">
                      <div className="row align-items-center">
                        <div className="col">
                          <br />
                          <br />
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            onClick={() => handleButtonClick("soloPlayer")}
                          >
                            <span className="display-6">Solo-player</span>
                          </button>
                        </div>
                        <div className="col">
                          {" "}
                          <br />
                          <br />
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            onClick={() => handleButtonClick("multiplayer")}
                          >
                            <span className="display-6"> Multiplayer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {activeView !== null && (
                  <>
                    {renderSoloPlayerOptions()}
                    {renderMultiplayerOptions()}
                    {renderJoinMultiplayerOptions()}
                    <button className="btn btn-secondary" onClick={handleBack}>
                      Back
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container-lg p-5 text-light">
            <div className="row justify-content-center">
              <div className="col-md-5 text-center">
                <p className="display-6 text-center">
                  Must be logged in to play.
                </p>

                <br />
                <br />

                <button
                  className="btn btn-dark btn-lg "
                  onClick={() => navigate("/Login")}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;