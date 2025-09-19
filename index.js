/* 

*/
let fightersState = {}; // persistent across updates

function updateFighterOptions() {
  const numFighters = parseInt(document.getElementById("numFighters").value);
  const container = document.getElementById("fighterOptions");

  // --- Save existing state ---
  const existingWrappers = container.querySelectorAll(".fighter-option");
  existingWrappers.forEach((wrapper, i) => {
    const handsSelect = wrapper.querySelector("select#fighter" + (i+1) + "Hands");
    const numHands = parseInt(handsSelect.value);
    const weapons = [];
    for (let h = 1; h <= numHands; h++) {
      const weaponSelect = wrapper.querySelector(`#fighter${i+1}Hand${h}Weapon`);
      if (weaponSelect) weapons[h] = weaponSelect.value;
    }
    fightersState[i+1] = {
      hands: numHands,
      weapons: weapons
    };
  });

  container.innerHTML = "";

  // --- Horizontal line ---
  const separator = document.createElement("hr");
  separator.style.margin = "1rem 0";
  container.appendChild(separator);

  const weaponOptions = ["Sword", "Unarmed", "Staff", "Shield"];

  for (let i = 0; i < numFighters; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "fighter-option";
    wrapper.style.marginBottom = "1.5rem";

    // --- Line 1: Combatant # ---
    const combatantLabel = document.createElement("div");
    combatantLabel.innerText = `Combatant ${i + 1}`;
    combatantLabel.style.fontWeight = "bold";
    combatantLabel.style.marginBottom = "0.3rem";
    wrapper.appendChild(combatantLabel);

    // --- Line 2: Hands label + dropdown ---
    const handRow = document.createElement("div");
    handRow.style.display = "flex";
    handRow.style.alignItems = "center";
    handRow.style.gap = "0.5rem";
    handRow.style.marginBottom = "0.3rem";

    const label = document.createElement("label");
    label.innerText = "Hands:";

    const handSelect = document.createElement("select");
    handSelect.id = `fighter${i + 1}Hands`;
    for (let h = 1; h <= 4; h++) {
      const option = document.createElement("option");
      option.value = h;
      option.innerText = h;
      handSelect.appendChild(option);
    }

    // Restore previous number of hands if exists
    if (fightersState[i+1]) {
      handSelect.value = fightersState[i+1].hands;
    } else {
      handSelect.value = 1;
    }

    handRow.appendChild(label);
    handRow.appendChild(handSelect);
    wrapper.appendChild(handRow);

    // --- Line 3: Weapon selectors ---
    const weaponRow = document.createElement("div");
    weaponRow.style.display = "flex";
    weaponRow.style.gap = "1rem";
    weaponRow.style.flexWrap = "wrap";
    weaponRow.style.justifyContent = "center";

    const createWeaponDropdown = (handIndex) => {
      const col = document.createElement("div");
      col.style.display = "flex";
      col.style.flexDirection = "column";
      col.style.alignItems = "center";

      const handLabel = document.createElement("label");
      handLabel.innerText = `Hand ${handIndex}`;
      handLabel.style.fontSize = "0.85rem";
      handLabel.style.marginBottom = "0.2rem";

      const weaponSelect = document.createElement("select");
      weaponSelect.id = `fighter${i + 1}Hand${handIndex}Weapon`;
      weaponSelect.style.minWidth = "105px"; // make it wider
      weaponOptions.forEach(w => {
        const wOption = document.createElement("option");
        wOption.value = w;
        wOption.innerText = w;
        weaponSelect.appendChild(wOption);
      });


      // Restore previous weapon selection if exists
      if (fightersState[i+1] && fightersState[i+1].weapons[handIndex]) {
        weaponSelect.value = fightersState[i+1].weapons[handIndex];
      }

      col.appendChild(handLabel);
      col.appendChild(weaponSelect);
      return col;
    };

    let numHands = parseInt(handSelect.value);
    for (let h = 1; h <= numHands; h++) {
      weaponRow.appendChild(createWeaponDropdown(h));
    }

    // Update weapon dropdowns on hands change
    handSelect.addEventListener("change", () => {
      const oldSelections = [];
      for (let h = 1; h <= weaponRow.children.length; h++) {
        const select = document.getElementById(`fighter${i + 1}Hand${h}Weapon`);
        if (select) oldSelections[h] = select.value;
      }
      weaponRow.innerHTML = "";
      numHands = parseInt(handSelect.value);
      for (let h = 1; h <= numHands; h++) {
        const col = createWeaponDropdown(h);
        if (oldSelections[h]) col.querySelector("select").value = oldSelections[h];
        weaponRow.appendChild(col);
      }
      // Update fightersState
      fightersState[i+1] = {
        hands: numHands,
        weapons: Array.from({length: numHands + 1}, (_, k) => oldSelections[k] || weaponOptions[0])
      };
    });

    wrapper.appendChild(weaponRow);
    container.appendChild(wrapper);
  }

  // Remove extra fighters from fightersState if number decreased
  for (let f in fightersState) {
    if (f > numFighters) delete fightersState[f];
  }
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

  // Collect hand count for each fighter and their weapon choices
  const fighterOptions = [];
  const fightersStateToSave = [];

  for (let i = 1; i <= numFighters; i++) {
    const handsSelect = document.getElementById(`fighter${i}Hands`);
    const hands = handsSelect ? parseInt(handsSelect.value) : 1;
    fighterOptions.push(hands);

    const weapons = [];
    for (let h = 1; h <= hands; h++) {
      const sel = document.getElementById(`fighter${i}Hand${h}Weapon`);
      weapons[h - 1] = sel ? sel.value : ""; // zero-based in array
    }

    fightersStateToSave.push({
      hands: hands,
      weapons: weapons
    });
  }

  // Save to localStorage (spreadsheet builder will read this)
  localStorage.setItem("fightTitle", fightName);
  localStorage.setItem("numFighters", numFighters);
  localStorage.setItem("fighterOptions", JSON.stringify(fighterOptions)); // legacy (counts)
  localStorage.setItem("fightersState", JSON.stringify(fightersStateToSave)); // new full structure
  localStorage.setItem("author", author);

  // Redirect
  window.location.href = "spreadsheet.html";
}


// Initialize with default (2 fighters)
window.onload = () => {
  updateFighterOptions();
};
