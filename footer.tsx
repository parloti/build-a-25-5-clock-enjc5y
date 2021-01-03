import React from "react";
import { Component } from "react";

export class Footer extends Component {
  render() {
    return (
      <footer className="text-center">
        <hr />
        <p>
          Written and coded by{" "}
          <a
            id="profile-link"
            href="https://www.freecodecamp.com/parloti"
            target="_blank"
          >
            <strong>
              <u>Alex Parloti</u>
            </strong>
          </a>
          .
        </p>
      </footer>
    );
  }
}
