import {
    delete_input,
    start_cards,
    display_skip_button,
    increment_idx,
    increment_score,
    CLASS_NAME,
} from "./App";

export async function enter_answer(curr_qb_idx) {
  var curr_question = curr_qb_idx[0];
  var curr_answer = curr_qb_idx[1];
  var question_elt = document.getElementById("CurrentQuestion");
  question_elt.textContent = curr_question;
  var answer_elt = document.getElementById("CurrentAnswer");
  var input_array = new Array(curr_answer.length);
  for (let i = 0; i < curr_answer.length; i++) {
    let input = document.createElement("input");
    input.type = "text";
    input.id = `answerInput_${i}`; // Unique ID for each input
    input.maxLength = 2; // Limit to one character
    input.size = 1;
    input.addEventListener("input", function () {
      if (this.value.length === 1) {
        this.value = this.value.toLowerCase();
        if (!this.value.match(/[a-z]/i)) {
          this.value = "";
          return;
        }
        const next_input = document.getElementById(`answerInput_${i + 1}`);
        input_array[i] = this.value;
        if (next_input) {
          next_input.focus(); // Move focus to the next input
        }
        const user_answer = input_array.join("");
        if (user_answer === curr_answer) {
          //correct
          increment_idx();
          increment_score();
          delete_input();
          start_cards(CLASS_NAME);
        } else if (user_answer.length === curr_answer.length) {
          //incorrect
          const skip_button = document.getElementById("SkipButton");
          if (!skip_button) {
            display_skip_button();
          }
        }
      }
      if (this.value.length === 0) {
        input_array[i] = "";
        const prev_input = document.getElementById(`answerInput_${i - 1}`);
        if (prev_input) {
          prev_input.focus(); // Move focus to the prev input
        }
      }
      if (this.value.length === 2) {
        if (!this.value[0].match(/[a-z]/i)) {
          this.value = this.value[1];
          input_array[i] = this.value;
          return;
        }
        if (!this.value[1].match(/[a-z]/i)) {
          this.value = this.value[0];
          input_array[i] = this.value;
          return;
        }
        const next_input = document.getElementById(`answerInput_${i + 1}`);
        if (next_input) {
          next_input.value = this.value[1];
          input_array[i + 1] = this.value[1];
          next_input.focus(); // Move focus to the next input
        }
        this.value = this.value[0];
        input_array[i] = this.value;
      }
    });
    answer_elt.appendChild(input);
  }
}
