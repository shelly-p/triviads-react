import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth, collection, db, doc, where, artQuestions,
  entertainmentQuestions,
  geographyQuestions,
  historyQuestions,
  mythologyQuestions,
  religionQuestions,
  scienceQuestions,
  sportsQuestions,
  query, updateDoc, onAuthStateChanged, onSnapshot,
} from "../firebase";


function Timer({ onTimerEnd }) {
  const [seconds, setSeconds] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      onTimerEnd();
      setSeconds(20);
    }
  }, [seconds, onTimerEnd]);

  return (
    <div>
      <p>Timer: {seconds}</p>
    </div>
  );
}

const Game = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentGameInfo, setCurrentGameInfo] = useState(JSON.parse(localStorage.getItem("gameInfo")));
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameLength, setGameLength] = useState(0);
  const [answerMsg, setAnswerMsg] = useState('');
  const [clicked, setClicked] = useState(false);
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
  }, []);

  useEffect(() => {
    const unsubscribe = () => {
      if (currentGameInfo.category === "arts & literature") {
        setQuestionData(artQuestions);
      }
      if (currentGameInfo.category === "entertainment") {
        setQuestionData(entertainmentQuestions)
      }
      if (currentGameInfo.category === "geography") {
        setQuestionData(geographyQuestions)
      }
      if (currentGameInfo.category === "history") {
        setQuestionData(historyQuestions)
      }
      if (currentGameInfo.category === "mythology") {
        setQuestionData(mythologyQuestions)
      }
      if (currentGameInfo.category === "religion") {
        setQuestionData(religionQuestions)
      }
      if (currentGameInfo.category === "science") {
        setQuestionData(scienceQuestions)
      }
      if (currentGameInfo.category === "sports") {
        setQuestionData(sportsQuestions)
      }

      if (questionData) {
        setIsLoading(false);
        setGameLength(currentGameInfo.numOfQuestions);
      }
    };
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentGameInfo) {
      const q = query(collection(db, "players"), where("gameID", "==", currentGameInfo.access));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedPlayers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayers(updatedPlayers);

      });
      return unsubscribe;
    }
  }, [currentGameInfo]);

  const handleAnswerButtonClick = (isCorrect) => {
    const points = calculatePoints(questionData[currentQuestion].difficulty);
    if (isCorrect === true) {
      setAnswerMsg("Correct!")
      setTotalPoints(totalPoints + points);
      addPointsToCollection(totalPoints + points);
      //addPointsToLeaderboard(totalPoints + points);
    }
    setClicked(true);
    answerMessage(isCorrect);
  }

  const answerMessage = (correct) => {
    if (correct) {
      setAnswerMsg("Correct!");
    } else {
      setAnswerMsg("Incorrect!");;
    }
  }

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < gameLength) {
      setCurrentQuestion(nextQuestion);
      setAnswerMsg("");
      setClicked(false);
    } else {
      setIsGameOver(true);
    }
  }

  const addPointsToCollection = async (totalPoints) => {
    const docId = localStorage.getItem("docId");
    console.log("docId: ", docId);
    const playerRef = doc(db, "players", docId);
    await updateDoc(playerRef, {
      points: totalPoints
    });
  }
/* // this is still not working
  const addPointsToLeaderboard = async (totalPoints) => {
    const username = localStorage.getItem("username");
    try {
      const leaderboardRef = doc(collection(db, "leaderboard"), username);
      await updateDoc(leaderboardRef, {
        pointsTotal: totalPoints,
      });
    } catch (error) {
      console.error("Error updating leaderboard: ", error);
    }
  };
*/
  const calculatePoints = (difficulty) => {
    switch (difficulty) {
      case 1:
        return 100;
      case 2:
        return 150;
      case 3:
        return 200;
      case 4:
        return 250;
      case 5:
        return 500;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container text-center">
      <div className="row">
        {authenticatedUser ? (
          <>
            <div className="col-6">
              <h1 className="text-white">Trivia Game</h1>
              <div className="login-card-container">
                {isGameOver ? (
                  <div className="login-card w-100 h-100">
                    <p className="display-3 text-white">Game Over!</p>
                  </div>
                ) : (
                  <>
                    <div className="card-header text-white">
                      {<Timer onTimerEnd={handleNextQuestion} />}
                      Question {questionData[currentQuestion].questionID} of {gameLength}
                    </div>

                    <div className="login-card w-100 h-100">
                      <h5 className="bolder text-light">{answerMsg}</h5>
                      <p>Difficulty: {questionData[currentQuestion].difficulty}</p>
                      <p>Total Points: {totalPoints}</p>
                      <p className="">{questionData[currentQuestion].question}</p>
                    </div>
                    <div className="">
                      {questionData[currentQuestion].answer.map((answers) =>
                        <div className="p-2">
                          <div className="card">
                            <button className="btn btn-outline-primary btn-block"
                              onClick={() => handleAnswerButtonClick(answers.isCorrect)}
                              disabled={clicked}>
                              {answers.option}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* display list of players here */}
            <div className="col">
              <h3 className="text-white">Players</h3>
              <table className="table">
                <thead>
                  <tr className="table-light">
                    <th scope="col">Name</th>
                    <th scope="col">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr className="table-light" key={player.id}>
                      <td>{player.name}</td>
                      <td>{player.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <p className="display-5 text-center text-white">Must be logged in to play.</p>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate("/Login")}>Go to Login</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;