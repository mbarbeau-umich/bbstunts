let footworkOptions = [];
let handOptions = [];
let eOptions = [];

/* 
Load dropdown option sets ---
*/
async function loadOptions() {
  try {
    const [footworkRes, handRes, eRes] = await Promise.all([
      fetch("o_footwork.txt"),
      fetch("o_sword.txt"),
      fetch("o_e.txt")
    ]);

    // Convert to arrays (one item per line)
    const [footworkText, handText, eText] = await Promise.all([
      footworkRes.text(),
      handRes.text(),
      eRes.text()
    ]);

    footworkOptions = [""].concat(
      footworkText.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    );
    handOptions = [""].concat(
      handText.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    );
    eOptions = [""].concat(
      eText.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    );

    console.log("Options loaded:", { footworkOptions, handOptions, eOptions });
  } catch (err) {
    console.error("Error loading option files:", err);

    // FALLBACK: sensible defaults so UI still works even if fetch fails
    footworkOptions = ["", "Advance", "Retreat", "Cross Over Advance", "Cross Over Retreat", "Pass Forward", "Pass Back"];
    handOptions = ["", "Punch", "Block", "Parry", "Slash", "Thrust"];
    eOptions = ["", "←", "→", "←→", "→←"];

    console.log("Using default option sets as fallback.");
  }
} // **************************************************************************************

/* 
Generates drop down item based on a given option list
*/
let dropdownCounter = 0; // ensure unique datalist IDs
function createDropdown(options) {
  dropdownCounter++;
  const listId = "dropdownList_" + dropdownCounter;

  // Create the input field that will use the datalist
  const input = document.createElement("input");
  input.setAttribute("list", listId);
  input.setAttribute("class", "dropdown-input");

  // Create the datalist element
  const datalist = document.createElement("datalist");
  datalist.id = listId;

  // Populate datalist with options
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    datalist.appendChild(option);
  });

  // Wrap input + datalist in a container so they stay together
  const wrapper = document.createElement("div");
  wrapper.appendChild(input);
  wrapper.appendChild(datalist);

  return wrapper;
} // **************************************************************************************

/* 
Constructs the table based on the selected configuration/fighter options
*/
function buildSpreadsheet() {
  const table = document.getElementById("spreadsheetTable");

  // Make sure table is NOT editable (remove any leftover attribute)
  table.removeAttribute("contenteditable");
  table.contentEditable = "false";

  const title = localStorage.getItem("fightTitle") || "Demo Fight";
  const numFighters = parseInt(localStorage.getItem("numFighters")) || 2;
  const fighterOptions = JSON.parse(localStorage.getItem("fighterOptions")) || [2, 2];
  const author = localStorage.getItem("author") || "Unknown";
  const dateStr = new Date().toLocaleDateString();

  table.innerHTML = "";

  // --- Compute total columns ---
  let totalCols = 0;
  if (numFighters === 2) {
    totalCols = fighterOptions.reduce((a, b) => a + b + 1, 0) + 1; // +1 shared {e}
  } else {
    totalCols = fighterOptions.reduce((a, b) => a + b + 2, 0); // footwork + {e} + hands
  }

  // --- Row 1: Author (left), Title (center), Date (right) ---
  const headerRow = table.insertRow();
  
  const authorCell = headerRow.insertCell();
  authorCell.innerText = `Author(s): ${author}`;
  authorCell.style.textAlign = "left";
  authorCell.style.borderBottom = "2px solid black";
  authorCell.style.padding = "8px";
  authorCell.contentEditable = "true"; // editable
  
  const titleCell = headerRow.insertCell();
  titleCell.colSpan = totalCols - 2; // take up middle space
  titleCell.innerHTML = `<strong>${title}</strong>`;
  titleCell.style.textAlign = "center";
  titleCell.style.borderBottom = "2px solid black";
  titleCell.style.padding = "8px";
  titleCell.contentEditable = "true"; // editable
  
  const dateCell = headerRow.insertCell();
  dateCell.innerText = dateStr;
  dateCell.style.textAlign = "right";
  dateCell.style.borderBottom = "2px solid black";
  dateCell.style.padding = "8px";


  // --- Spacer row ---
  const spacerRow = table.insertRow();
  const spacerCell = spacerRow.insertCell();
  spacerCell.colSpan = totalCols;
  spacerCell.style.height = "6px";
  spacerCell.style.backgroundColor = "#eee";

  // --- Fighter headers ---
  const fighterRow = table.insertRow();
  if (numFighters === 2) {
    const f1 = fighterRow.insertCell();
    f1.colSpan = fighterOptions[0] + 1;
    f1.innerText = "Fighter 1";
    f1.style.border = "2px solid black";
    f1.style.textAlign = "center";
    f1.contentEditable = "true"; 

    const eCell = fighterRow.insertCell();
    eCell.rowSpan = 2;
    eCell.innerText = "{e}";
    eCell.style.border = "2px solid black";
    eCell.style.textAlign = "center";

    const f2 = fighterRow.insertCell();
    f2.colSpan = fighterOptions[1] + 1;
    f2.innerText = "Fighter 2";
    f2.style.border = "2px solid black";
    f2.style.textAlign = "center";
    f2.contentEditable = "true"; 
  } else {
    for (let i = 0; i < numFighters; i++) {
      const f = fighterRow.insertCell();
      f.colSpan = fighterOptions[i] + 2;
      f.innerText = `Fighter ${i + 1}`;
      f.style.border = "2px solid black";
      f.style.textAlign = "center";
      f.contentEditable = "true"; 
    }
  }

  // --- Sub-header row ---
  const subHeaderRow = table.insertRow();
  const colTypes = []; // track column types

  if (numFighters === 2) {
    ["Footwork", ...Array.from({ length: fighterOptions[0] }, (_, i) => `Hand ${i + 1}`)]
      .forEach(c => {
        const cell = subHeaderRow.insertCell();
        cell.innerText = c;
        colTypes.push(c.startsWith("Hand") ? "hand" : "footwork");
        cell.style.border = "1px solid gray";
        cell.style.textAlign = "center";
        cell.contentEditable = "true";
      });

    colTypes.push("e"); // shared {e}

    ["Footwork", ...Array.from({ length: fighterOptions[1] }, (_, i) => `Hand ${i + 1}`)]
      .forEach(c => {
        const cell = subHeaderRow.insertCell();
        cell.innerText = c;
        colTypes.push(c.startsWith("Hand") ? "hand" : "footwork");
        cell.style.border = "1px solid gray";
        cell.style.textAlign = "center";
        cell.contentEditable = "true";
      });
  } else {
    fighterOptions.forEach(hands => {
      ["Footwork", "{e}", ...Array.from({ length: hands }, (_, i) => `Hand ${i + 1}`)]
        .forEach(c => {
          const cell = subHeaderRow.insertCell();
          cell.innerText = c;
          colTypes.push(c === "{e}" ? "e" : (c.startsWith("Hand") ? "hand" : "footwork"));
          cell.style.border = "1px solid gray";
          cell.style.textAlign = "center";
          cell.contentEditable = "false";
        });
    });
  }

  // --- Example blank rows (dropdowns only, no contentEditable on td) ---
  for (let r = 0; r < 10; r++) {
    const row = table.insertRow();
    for (let c = 0; c < totalCols; c++) {
      const cell = row.insertCell();

      // ensure td itself is NOT editable
      cell.contentEditable = "false";
      cell.style.border = "1px solid gray";
      cell.style.padding = "4px";

      // append the dropdown wrapper (createDropdown returns a wrapper DIV with input + datalist)
      if (colTypes[c] === "footwork") {
        const wrapper = createDropdown(footworkOptions);
        // make the actual input fill the cell
        const input = wrapper.querySelector("input[list]");
        if (input) {
          input.style.width = "100%";
          input.style.boxSizing = "border-box";
        }
        cell.appendChild(wrapper);
      } else if (colTypes[c] === "hand") {
        const wrapper = createDropdown(handOptions);
        const input = wrapper.querySelector("input[list]");
        if (input) {
          input.style.width = "100%";
          input.style.boxSizing = "border-box";
        }
        cell.appendChild(wrapper);
      } else if (colTypes[c] === "e") {
        const wrapper = createDropdown(eOptions);
        const input = wrapper.querySelector("input[list]");
        if (input) {
          input.style.width = "100%";
          input.style.boxSizing = "border-box";
        }
        cell.appendChild(wrapper);
      } else {
        // unknown type: keep non-editable blank
        cell.innerText = "";
      }
    }
  }
} // **************************************************************************************

/* 
Exports the table to an excel (.xlsx) file
*/
function exportSpreadsheet() {
  const table = document.getElementById("spreadsheetTable");

  // Build array of arrays from the table
  const sheetData = [];
  for (let row of table.rows) {
    const rowData = [];
    for (let cell of row.cells) {
      let value = "";

      // If the cell has a datalist-based input
      const input = cell.querySelector("input[list]");
      if (input) {
        value = input.value.trim(); // either typed or selected option
      }
      // If the cell has a <select> (legacy case)
      else {
        const select = cell.querySelector("select");
        if (select) {
          value = select.options[select.selectedIndex]?.text || "";
        } else {
          value = cell.innerText.trim();
        }
      }

      rowData.push(value);
    }
    sheetData.push(rowData);
  }

  // Convert array to worksheet
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Create a workbook and append sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Fight Sheet");

  // --- Grab fight title from first row, center cell ---
  let fightTitle = "Fight";
  if (table.rows.length > 0) {
    const headerRow = table.rows[0];
    const middleCellIndex = Math.floor(headerRow.cells.length / 2);
    fightTitle = headerRow.cells[middleCellIndex].innerText.trim() || "Fight";
  }

  // Sanitize filename
  fightTitle = fightTitle.replace(/[^a-z0-9_\-]/gi, "_");

  // Suggest filename to user
  let filename = prompt("Enter filename for export:", `SPAR_${fightTitle}.xlsx`);
  if (!filename) return;

  if (!filename.endsWith(".xlsx")) {
    filename += ".xlsx";
  }

  XLSX.writeFile(wb, filename);
}

/*
Adds a BLANK row to the bottom of the table with the same formatting as the previous bottom row
*/
function addRow() {
  const table = document.getElementById("spreadsheetTable");
  if (table.rows.length < 1) return; // no rows yet

  const templateRowIndex = table.rows.length - 2; // last data row index
  const templateRow = table.rows[templateRowIndex];
  const newRow = table.insertRow();

  for (let c = 0; c < templateRow.cells.length; c++) {
    const newCell = newRow.insertCell();
    newCell.contentEditable = "false";
    newCell.style.cssText = templateRow.cells[c].style.cssText || "";

    // If template had an input[list], clone logic: find its datalist id and options
    const templateInput = templateRow.cells[c].querySelector("input[list]");
    if (templateInput) {
      const listId = templateInput.getAttribute("list");
      const datalist = document.getElementById(listId);
      const options = datalist ? Array.from(datalist.options).map(o => o.value) : [];
      const wrapper = createDropdown(options);
      const input = wrapper.querySelector("input[list]");
      if (input) { input.style.width = "100%"; input.style.boxSizing = "border-box"; }
      newCell.appendChild(wrapper);
      continue;
    }

    // legacy select handling
    const templateSelect = templateRow.cells[c].querySelector("select");
    if (templateSelect) {
      const clone = templateSelect.cloneNode(true);
      clone.value = "";
      newCell.appendChild(clone);
      continue;
    }

    // default blank
    newCell.innerText = "";
  }
} // **************************************************************************************

/* 
build the spreadsheet only after the options are loaded and DOM is ready
*/
document.addEventListener("DOMContentLoaded", async () => {
  await loadOptions();      // wait for .txt files (or fallback)
  buildSpreadsheet();       // now safe to build the table with loaded options
}); // **************************************************************************************

