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
    input.max = 2;
    input.value = 1;
    input.id = `fighter${i + 1}Hands`;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  }
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
