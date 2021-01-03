import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";
import { Footer } from "./footer";

interface AppProps {}
interface AppState {
  sessionLength: number;
  breakLength: number;
  paused: boolean;
  runningSession: boolean;
  runningBreak: boolean;
  remainSession?: number;
  remainBreak?: number;
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      paused: true,
      runningSession: false,
      runningBreak: false
    };
    this.reset = this.reset.bind(this);
    this.startPause = this.startPause.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
  }

  /**
   * User Story #11: When I click the element with the id of reset, any running timer should be stopped, the value within id="break-length" should return to 5, the value within id="session-length" should return to 25, and the element with id="time-left" should reset to it's default state.
   */
  reset() {
    clearInterval(this.interval);
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      runningSession: false,
      runningBreak: false,
      paused: true
    });
    /**
     * User Story #28: The audio element with id of beep must stop playing and be rewound to the beginning when the element with the id of reset is clicked.
     */
    this.resetBeep();
  }

  interval: number;

  runBreak() {
    /**
     * User Story #23: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), a new break countdown should begin, counting down from the value currently displayed in the id="break-length" element.
     */
    let remain = this.state.runningBreak
      ? this.state.remainBreak
      : this.state.breakLength * 60 * 1000;
    this.setState({
      runningSession: false,
      remainBreak: remain,
      runningBreak: true
    });

    this.interval = setInterval(() => {
      remain -= 1000;
      if (remain === 0) {
        /**
         * User Story #26: When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound indicating that time is up should play. This should utilize an HTML5 audio tag and have a corresponding id="beep".
         */
        this.playBeep();
      }
      if (remain >= 0) {
        this.setState({
          remainBreak: remain,
          runningBreak: true
        });
      } else {
        clearInterval(this.interval);
        /**
         * User Story #24: When a break countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a session has begun.
         */
        this.setState({
          runningBreak: false
        });
        /**
         * User Story #25: When a break countdown reaches zero (NOTE: timer MUST reach 00:00), a new session countdown should begin, counting down from the value currently displayed in the id="session-length" element.
         */
        this.runSession();
      }
    }, 1000);
  }

  /**
   * User Story #18: When I first click the element with id="start_stop", the timer should begin running from the value currently displayed in id="session-length", even if the value has been incremented or decremented from the original value of 25.
   * User Story #19: If the timer is running, the element with the id of time-left should display the remaining time in mm:ss format (decrementing by a value of 1 and updating the display every 1000ms).
   */
  runSession() {
    /**
     * User Story #21: If the timer is paused and I click the element with id="start_stop", the countdown should resume running from the point at which it was paused.
     */
    let remain = this.state.runningSession
      ? this.state.remainSession
      : this.state.sessionLength * 60 * 1000;
    this.interval = setInterval(() => {
      remain -= 1000;
      if (remain === 0) {
        /**
         * User Story #26: When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound indicating that time is up should play. This should utilize an HTML5 audio tag and have a corresponding id="beep".
         */
        this.playBeep();
      }
      if (remain >= 0) {
        this.setState({
          remainSession: remain,
          runningSession: true
        });
      } else {
        clearInterval(this.interval);
        /**
         * User Story #22: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a break has begun.
         */
        this.runBreak();
      }
    }, 1000);
  }

  /**
   * User Story #18: When I first click the element with id="start_stop", the timer should begin running from the value currently displayed in id="session-length", even if the value has been incremented or decremented from the original value of 25.
   */
  startPause() {
    if (this.state.paused) {
      /**
       * User Story #21: If the timer is paused and I click the element with id="start_stop", the countdown should resume running from the point at which it was paused.
       */
      this.runSession();
      this.setState({ paused: false });
    } else {
      /**
       * User Story #20: If the timer is running and I click the element with id="start_stop", the countdown should pause.
       */
      clearInterval(this.interval);
      this.setState({ paused: true });
    }
  }

  /**
   * User Story #12: When I click the element with the id of break-decrement, the value within id="break-length" decrements by a value of 1, and I can see the updated value.
   * User Story #16: I should not be able to set a session or break length to <= 0.
   */
  breakDecrement() {
    this.setState({
      breakLength: Math.max(this.state.breakLength - 1, 1)
    });
  }

  /**
   * User Story #13: When I click the element with the id of break-increment, the value within id="break-length" increments by a value of 1, and I can see the updated value.
   * User Story #17: I should not be able to set a session or break length to > 60.
   */
  breakIncrement() {
    this.setState({
      breakLength: Math.min(this.state.breakLength + 1, 60)
    });
  }

  /**
   * User Story #14: When I click the element with the id of session-decrement, the value within id="session-length" decrements by a value of 1, and I can see the updated value.
   * User Story #16: I should not be able to set a session or break length to <= 0.
   */
  sessionDecrement() {
    this.setState({
      sessionLength: Math.max(this.state.sessionLength - 1, 1)
    });
  }

  /**
   * User Story #15: When I click the element with the id of session-increment, the value within id="session-length" increments by a value of 1, and I can see the updated value.
   * User Story #17: I should not be able to set a session or break length to > 60.
   */
  sessionIncrement() {
    this.setState({
      sessionLength: Math.min(this.state.sessionLength + 1, 60)
    });
  }

  /**
   * User Story #8: I can see an element with corresponding id="time-left". NOTE: Paused or running, the value in this field should always be displayed in mm:ss format (i.e. 25:00).
   */
  get formatedRemain() {
    let time: number;
    if (this.state.runningSession) {
      time = this.state.remainSession;
    } else if (this.state.runningBreak) {
      time = this.state.remainBreak;
    } else {
      time = this.state.sessionLength * 60 * 1000;
    }
    return this.getFormatedTime(time);
  }

  getFormatedTime(remain: number) {
    const minutes = Math.floor(remain / 60 / 1000);
    const seconds = Math.floor(remain / 1000 - minutes * 60);
    let format: string;

    if (minutes < 10) {
      format = `0${minutes}:`;
    } else {
      format = `${minutes}:`;
    }

    if (seconds < 10) {
      format += `0${seconds}`;
    } else {
      format += `${seconds}`;
    }
    return format;
  }

  /**
   * User Story #26: When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound indicating that time is up should play. This should utilize an HTML5 audio tag and have a corresponding id="beep".
   */
  playBeep() {
    this.resetBeep();
    const beep = document.querySelector("#beep") as HTMLAudioElement;
    beep.play();
  }

  resetBeep() {
    /**
     * User Story #28: The audio element with id of beep must stop playing and be rewound to the beginning when the element with the id of reset is clicked.
     */
    const beep = document.querySelector("#beep") as HTMLAudioElement;
    beep.pause();
    beep.currentTime = 0;
  }

  render() {
    return (
      <div className="jumbotron jumbotron-fluid h-100 m-0">
        <div className="h-100 d-flex flex-column align-items-stretch">
          <h1 className="text-center">25 + 5 Clock</h1>
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex">
              <div className="d-flex flex-column m-4">
                {/**
                 * User Story #1: I can see an element with id="break-label" that contains a string (e.g. "Break Length").
                 */
                /**
                 * User Story #23: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), a new break countdown should begin, counting down from the value currently displayed in the id="break-length" element.
                 */}
                <div id="break-label" className="text-center">
                  Break Length
                </div>
                <div className="d-flex justify-content-around align-items-center">
                  <button
                    id="break-decrement"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.breakDecrement}
                  >
                    ⮟
                  </button>
                  {/**
                   * User Story #5: I can see an element with a corresponding id="break-length", which by default (on load) displays a value of 5.
                   */}
                  <div id="break-length" className="m-3">
                    {this.state.breakLength}
                  </div>
                  <button
                    id="break-increment"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.breakIncrement}
                  >
                    ⮝
                  </button>
                </div>
              </div>
              <div className="d-flex flex-column m-4">
                {/**
                 * User Story #2: I can see an element with id="session-label" that contains a string (e.g. "Session Length").
                 */}
                <div id="session-label" className="text-center">
                  Session Length
                </div>
                <div className="d-flex justify-content-around align-items-center">
                  {/**
                   * User Story #3: I can see two clickable elements with corresponding IDs: id="break-decrement" and id="session-decrement".
                   */}
                  <button
                    id="session-decrement"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.sessionDecrement}
                  >
                    ⮟
                  </button>
                  {/**
                   * User Story #6: I can see an element with a corresponding id="session-length", which by default displays a value of 25.
                   */
                  /**
                   * User Story #18: When I first click the element with id="start_stop", the timer should begin running from the value currently displayed in id="session-length", even if the value has been incremented or decremented from the original value of 25.
                   */
                  /**
                   * User Story #25: When a break countdown reaches zero (NOTE: timer MUST reach 00:00), a new session countdown
                  should begin, counting down from the value currently displayed in the id="session-length" element.
                  */}
                  <div id="session-length" className="m-3">
                    {this.state.sessionLength}
                  </div>
                  {/**
                   * User Story #4: I can see two clickable elements with corresponding IDs: id="break-increment" and id="session-increment".
                   */}
                  <button
                    id="session-increment"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.sessionIncrement}
                  >
                    ⮝
                  </button>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column m-4 justify-content-around align-items-center">
              {/**
              * User Story #7: I can see an element with a corresponding
              id="timer-label", that contains a string indicating a session is
              initialized (e.g. "Session").
              */
              /**
               * User Story #22: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a break has begun.
               */
              /**
               * User Story #22: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a break has begun.
               */
              /**
               * User Story #24: When a break countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a session has begun.
               */}
              <div id="timer-label">
                {this.state.runningBreak ? "Break" : "Session"}
              </div>
              {/**
               * User Story #8: I can see an element with corresponding id="time-left". NOTE: Paused or running, the value in this field should always be displayed in mm:ss format (i.e. 25:00).
               */
              /**
               * User Story #19: If the timer is running, the element with the id of time-left should display the remaining time in mm:ss format (decrementing by a value of 1 and updating the display every 1000ms).
               */}
              <div id="time-left">{this.formatedRemain}</div>
              <div className="d-flex m-4">
                {/**
                 * User Story #9: I can see a clickable element with a corresponding id="start_stop".
                 */}
                <button
                  onClick={this.startPause}
                  id="start_stop"
                  type="button"
                  className="btn btn-primary mr-3"
                >
                  {this.state.paused ? "⯈" : "⏸"}
                </button>
                {/**
                 * User Story #10: I can see a clickable element with a corresponding id="reset".
                 */}
                <button
                  onClick={this.reset}
                  id="reset"
                  type="button"
                  className="btn btn-primary"
                >
                  ↻
                </button>
              </div>
            </div>
          </div>
          {/**
           * User Story #26: When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound indicating that time is up should play. This should utilize an HTML5 audio tag and have a corresponding id="beep".
           */
          /**
           * User Story #27: The audio element with id="beep" must be 1 second or longer.
           */}
          <audio
            className=""
            id="beep"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          />
          <Footer />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
