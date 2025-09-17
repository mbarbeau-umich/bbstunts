/* 

*/
function updateFighterOptions() {
  const numFighters = parseInt(document.getElementById("numFighters").value);
  const container = document.getElementById("fighterOptions");

  container.innerHTML = ""; // clear old ones

  for (let i = 0; i < numFighters; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "fighter-option";

    const label = document.createElement("label");
    label.innerText = `Fighter ${i + 1} – Hands: `;

    const input = document.createElement("input");
    input.type = "number";
    input.min = 1;
    input.max = 4;
    input.value = 1;
    input.id = `fighter${i + 1}Hands`;

    const clampValue = () => {
      let val = parseInt(input.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 4) val = 4;
      input.value = val;
    };

    input.addEventListener("input", clampValue);
    input.addEventListener("change", clampValue); // ensures value is clamped on blur

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  }
}

/* 
limits numOptions to avoid overflow
*/
const numFightersInput = document.getElementById("numFighters");
function clampNumFighters() {
  let val = parseInt(numFightersInput.value);
  if (isNaN(val) || val < 2) val = 2;
  if (val > 5) val = 5;
  numFightersInput.value = val;
  updateFighterOptions(); // call your existing update function
}

function importSpreadsheet() {
  alert("Import functionality is not implemented yet.");
  // const input = document.createElement("input");
  // input.type = "file";
  // input.accept = ".xlsx,.xls"; // limit to Excel files

  // input.addEventListener("change", (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     console.log("Selected file:", file.name);
  //     alert("Import functionality is not implemented yet.");
  //   }
  // });

  // input.click(); // opens the file dialog
}


// FUNCTION --> go to spreadsheet
function goToSpreadsheet() {
  const author = document.getElementById("author").value || "Unknown";
  const fightName = document.getElementById("fightName").value || "Untitled Fight";
  const numFighters = parseInt(document.getElementById("numFighters").value);

  // Collect hand count for each fighter
  const fighterOptions = [];
  for (let i = 0; i < numFighters; i++) {
    const val = parseInt(document.getElementById(`fighter${i + 1}Hands`).value);
    fighterOptions.push(val);
  }

  // Save to localStorage
  localStorage.setItem("fightTitle", fightName);
  localStorage.setItem("numFighters", numFighters);
  localStorage.setItem("fighterOptions", JSON.stringify(fighterOptions));
  localStorage.setItem("author", author);

  // Redirect
  window.location.href = "spreadsheet.html";
}

// Initialize with default (2 fighters)
window.onload = updateFighterOptions;

numFightersInput.addEventListener("input", clampNumFighters);
numFightersInput.addEventListener("change", clampNumFighters);
