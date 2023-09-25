import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const decrementBreak = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const incrementBreak = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementSession = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const incrementSession = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    let countdown;

    if (isRunning) {
      countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdown);
    }

    if (timeLeft === 0) {
      audioRef.current.play();
    }

    return () => clearInterval(countdown);
  }, [isRunning, timerLabel, breakLength, sessionLength, timeLeft]);

  return (
    <div className="App">
      <Card
        style={{
          width: "18rem",
          background: "#222",
          color: "white",
          padding: "10px",
          boxShadow: "0px 0px 10px rgba(122, 121, 121, 0.5)",
          border: "none",
        }}
      >
        <Card.Title>Clock</Card.Title>
        <Row>
          <Col>
            <Card.Subtitle id="break-label">Break Length</Card.Subtitle>
            <Button id="break-decrement" onClick={decrementBreak}>
              -
            </Button>
            <Card.Subtitle id="break-length">{breakLength}</Card.Subtitle>
            <Button id="break-increment" onClick={incrementBreak}>
              +
            </Button>
          </Col>

          <Col>
            <Card.Subtitle id="session-label">Session Length</Card.Subtitle>
            <Button id="session-decrement" onClick={decrementSession}>
              -
            </Button>
            <div id="session-length">{sessionLength}</div>
            <Button id="session-increment" onClick={incrementSession}>
              +
            </Button>
          </Col>
        </Row>

        <Card.Subtitle id="timer-label">{timerLabel}</Card.Subtitle>
        <div id="time-left">{formatTime(timeLeft)}</div>

        <Row>
          <Col>
            <Button
              variant="outline-success"
              id="start_stop"
              onClick={toggleTimer}
            >
              Start/Stop
            </Button>
          </Col>

          <Col>
            <Button
              variant="outline-danger"
              type="reset"
              value="Reset"
              id="reset"
              onClick={resetTimer}
            >
              Reset
            </Button>
          </Col>
        </Row>

        <audio id="beep" ref={audioRef}>
          <source src="beep.wav" type="audio/mpeg" />
        </audio>
      </Card>
    </div>
  );
}

export default App;
