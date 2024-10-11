import "./App.css";
import * as React from "react";
import qb from "./questions.json";
import { enter_answer } from "./answerHandler";

const CLASSES = Object.keys(qb);

function App() {
  return (
    <div className="App">
      <header className="App-header" id="Header">
        <p>Dragon Vocabulary</p>
        <div id="InputPrompt">Enter your 8 digit student ID</div>
        {input_login()}
        {submit_button()}
        <div>{class_array()}</div>
        <div id="CurrentQuestion"></div>
        <div id="CurrentAnswer"></div>
      </header>
    </div>
  );
}

export var CLASS_NAME = "";
var STUDENT_ID = "";

let idx = 0;
export function increment_idx(){idx++;}
let score = 0;
export function increment_score() {score++;}

function class_array() {
  return CLASSES.map((class_name) => (
    <button
      key={class_name}
      style={{ visibility: "hidden" }}
      id={class_name}
      onClick={() => {
        display_class(class_name);
        start_cards(class_name);
        CLASSES.forEach((class_name) => {
          document.getElementById(class_name).remove();
        });
      }}
    >
      {class_name}
    </button>
  ));
}
function input_login() {
  return (
    <input
      id="Login"
      type="text"
      onInput={(event) => {
        let value = event.target.value;
        // Allow only numbers and restrict the length to 8
        if (!/^\d*$/.test(value) || value.length > 8) {
          event.target.value = "";
        }
        var this_button = document.getElementById("SubmitButton");
        this_button.disabled = value.length !== 8;
      }}
    ></input>
  );
}
function submit_button() {
  return (
    <button
      id="SubmitButton"
      onClick={() => {
        var this_button = document.getElementById("SubmitButton");
        this_button.remove();

        var login = document.getElementById("Login");
        const student_id = login.value;
        login.remove();

        var input_prompt = document.getElementById("InputPrompt");
        input_prompt.remove();

        custom_login(student_id);
      }}
    >
      Submit
    </button>
  );
}

function custom_login(student_id) {
  CLASSES.forEach((class_name) => {
    document.getElementById(class_name).style.visibility = "visible";
  });
  STUDENT_ID = student_id;
}

function display_class(class_name_in) {
  CLASS_NAME = class_name_in;

  var header = document.getElementById("Header");
  let class_name_banner = document.createElement("div");
  class_name_banner.textContent = `Class: ${CLASS_NAME}`;
  header.prepend(class_name_banner);
}

export function start_cards() {
  var chk = document.getElementById("SkipButton");
  if (chk) {
    var answer_elt = document.getElementById("CurrentAnswer");
    answer_elt.removeChild(chk);
  }
  var curr_qb = qb[CLASS_NAME];
  if (idx >= curr_qb.length) {
    display_end();
    update_results_sheet();
    return;
  }
  enter_answer(curr_qb[idx], CLASS_NAME);
}

function display_end() {
  var question_elt = document.getElementById("CurrentQuestion");
  question_elt.style.visibility = "hidden";
  var header = document.getElementById("Header");
  let success_banner = document.createElement("Success");
  success_banner.textContent = `Congratulations on completing this assignment: Your score was ${score}/${idx}`;
  header.appendChild(success_banner);
}

function update_results_sheet() {
  const new_data = {
    student_id: STUDENT_ID,
    questions_attempted: idx,
    questions_correct: score,
    date: new Date().toISOString().split("T")[0], // Format date as YYYY-MM-DD
  };
  // TODO update google sheet
  console.log(new_data);
}

export function display_skip_button() {
  var answer_elt = document.getElementById("CurrentAnswer");
  let skip_button = document.createElement("button");
  skip_button.id = "SkipButton";
  skip_button.textContent = "Skip Question >";
  answer_elt.appendChild(skip_button);
  skip_button.onclick = function () {
    idx++;
    delete_input();
    start_cards(CLASS_NAME);
  };
}

export function delete_input() {
  var answer_elt = document.getElementById("CurrentAnswer");
  var i = 0;
  let next_input = document.getElementById(`answerInput_${i}`);
  while (next_input) {
    answer_elt.removeChild(next_input);
    i++;
    next_input = document.getElementById(`answerInput_${i}`);
  }
}

export default App;
