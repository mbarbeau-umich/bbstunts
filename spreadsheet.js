

// function buildSpreadsheet() {
//   const table = document.getElementById("spreadsheetTable");

//   const title = localStorage.getItem("fightTitle") || "Demo Fight";
//   const numFighters = parseInt(localStorage.getItem("numFighters")) || 2;
//   const fighterOptions = JSON.parse(localStorage.getItem("fighterOptions")) || [2, 2];
//   const author = localStorage.getItem("author") || "Unknown";
//   const dateStr = new Date().toLocaleDateString();

//   table.innerHTML = "";

//   // --- Compute total columns ---
//   let totalCols = 0;
//   if (numFighters === 2) {
//     totalCols = fighterOptions.reduce((a, b) => a + b + 1, 0) + 1; // +1 for shared {e}
//   } else {
//     totalCols = fighterOptions.reduce((a, b) => a + b + 2, 0); // +1 {e} per fighter
//   }

//   // --- Row 1: Title, Author, Date all in same row ---
//   const headerRow = table.insertRow();
//   const titleCell = headerRow.insertCell();
//   titleCell.colSpan = totalCols;
//   titleCell.innerHTML = `<strong>${title}</strong> &nbsp;&nbsp;&nbsp;&nbsp; Author: ${author} &nbsp;&nbsp;&nbsp;&nbsp; Date: ${dateStr}`;
//   titleCell.style.textAlign = "center";
//   titleCell.style.borderBottom = "2px solid black";
//   titleCell.style.padding = "8px";

//   // --- Spacer row ---
//   const spacerRow = table.insertRow();
//   const spacerCell = spacerRow.insertCell();
//   spacerCell.colSpan = totalCols;
//   spacerCell.style.height = "6px";
//   spacerCell.style.backgroundColor = "#eee";

//   // --- Fighter headers ---
//   const fighterRow = table.insertRow();
//   if (numFighters === 2) {
//     // Fighter 1
//     const f1 = fighterRow.insertCell();
//     f1.colSpan = fighterOptions[0] + 1; // footwork + hands
//     f1.innerText = "Fighter 1";
//     f1.style.border = "2px solid black";
//     f1.style.textAlign = "center";

//     // Shared {e}
//     const eCell = fighterRow.insertCell();
//     eCell.rowSpan = 2;
//     eCell.innerText = "{e}";
//     eCell.style.border = "2px solid black";
//     eCell.style.textAlign = "center";

//     // Fighter 2
//     const f2 = fighterRow.insertCell();
//     f2.colSpan = fighterOptions[1] + 1;
//     f2.innerText = "Fighter 2";
//     f2.style.border = "2px solid black";
//     f2.style.textAlign = "center";
//   } else {
//     // 3+ fighters
//     for (let i = 0; i < numFighters; i++) {
//       const f = fighterRow.insertCell();
//       f.colSpan = fighterOptions[i] + 2; // footwork + {e} + hands
//       f.innerText = `Fighter ${i + 1}`;
//       f.style.border = "2px solid black";
//       f.style.textAlign = "center";
//     }
//   }

//   // --- Sub-header row (Footwork / {e} / Hands) ---
//   const subHeaderRow = table.insertRow();
//   if (numFighters === 2) {
//     // Fighter 1 subheaders
//     ["Footwork", ...Array.from({length: fighterOptions[0]}, (_, i) => `Hand ${i+1}`)]
//       .forEach(c => {
//         const cell = subHeaderRow.insertCell();
//         cell.innerText = c;
//         cell.style.border = "1px solid gray";
//         cell.style.textAlign = "center";
//       });

//     // skip {e} (rowSpan covers it)

//     // Fighter 2 subheaders
//     ["Footwork", ...Array.from({length: fighterOptions[1]}, (_, i) => `Hand ${i+1}`)]
//       .forEach(c => {
//         const cell = subHeaderRow.insertCell();
//         cell.innerText = c;
//         cell.style.border = "1px solid gray";
//         cell.style.textAlign = "center";
//       });
//   } else {
//     // 3+ fighters
//     fighterOptions.forEach(hands => {
//       ["Footwork", "{e}", ...Array.from({length: hands}, (_, i) => `Hand ${i+1}`)]
//         .forEach(c => {
//           const cell = subHeaderRow.insertCell();
//           cell.innerText = c;
//           cell.style.border = "1px solid gray";
//           cell.style.textAlign = "center";
//         });
//     });
//   }

//   // --- Example blank rows ---
//   for (let r = 0; r < 10; r++) {
//     const row = table.insertRow();
//     for (let c = 0; c < totalCols; c++) {
//       const cell = row.insertCell();
//       cell.innerText = "";
//       cell.style.border = "1px solid gray";
//     }
//   }
// }

function buildSpreadsheet() {
  const table = document.getElementById("spreadsheetTable");

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

  // --- Row 1: Title, Author, Date ---
  const headerRow = table.insertRow();
  const titleCell = headerRow.insertCell();
  titleCell.colSpan = totalCols;
  titleCell.innerHTML = `<strong>${title}</strong> &nbsp;&nbsp;&nbsp;&nbsp; Author: ${author} &nbsp;&nbsp;&nbsp;&nbsp; Date: ${dateStr}`;
  titleCell.style.textAlign = "center";
  titleCell.style.borderBottom = "2px solid black";
  titleCell.style.padding = "8px";

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
  } else {
    for (let i = 0; i < numFighters; i++) {
      const f = fighterRow.insertCell();
      f.colSpan = fighterOptions[i] + 2;
      f.innerText = `Fighter ${i + 1}`;
      f.style.border = "2px solid black";
      f.style.textAlign = "center";
    }
  }

  // --- Sub-header row ---
  const subHeaderRow = table.insertRow();
  const colTypes = []; // keep track of column type for later row creation

  if (numFighters === 2) {
    ["Footwork", ...Array.from({length: fighterOptions[0]}, (_, i) => `Hand ${i+1}`)]
      .forEach(c => {
        const cell = subHeaderRow.insertCell();
        cell.innerText = c;
        colTypes.push(c.startsWith("Hand") ? "hand" : "footwork");
        cell.style.border = "1px solid gray";
        cell.style.textAlign = "center";
      });

    colTypes.push("e"); // shared {e}

    ["Footwork", ...Array.from({length: fighterOptions[1]}, (_, i) => `Hand ${i+1}`)]
      .forEach(c => {
        const cell = subHeaderRow.insertCell();
        cell.innerText = c;
        colTypes.push(c.startsWith("Hand") ? "hand" : "footwork");
        cell.style.border = "1px solid gray";
        cell.style.textAlign = "center";
      });
  } else {
    fighterOptions.forEach(hands => {
      ["Footwork", "{e}", ...Array.from({length: hands}, (_, i) => `Hand ${i+1}`)]
        .forEach(c => {
          const cell = subHeaderRow.insertCell();
          cell.innerText = c;
          colTypes.push(c === "{e}" ? "e" : (c.startsWith("Hand") ? "hand" : "footwork"));
          cell.style.border = "1px solid gray";
          cell.style.textAlign = "center";
        });
    });
  }

  // --- Example blank rows with dropdowns ---
  for (let r = 0; r < 10; r++) {
    const row = table.insertRow();
    for (let c = 0; c < totalCols; c++) {
      const cell = row.insertCell();
      cell.style.border = "1px solid gray";

      if (colTypes[c] === "footwork") {
        cell.appendChild(createDropdown(footworkOptions));
      } else if (colTypes[c] === "hand") {
        cell.appendChild(createDropdown(handOptions));
      } else if (colTypes[c] === "e") {
        cell.appendChild(createDropdown(eOptions));
      }
    }
  }
}




// function exportSpreadsheet() {
//   const table = document.getElementById("spreadsheetTable");
//   const wb = XLSX.utils.table_to_book(table, { sheet: "Fight Sheet" });

//   // Ask user for filename
//   let filename = prompt("Enter filename for export:", "fight_documentation.xlsx");

//   if (!filename) {
//     // User canceled
//     return;
//   }

//   // Ensure it ends with .xlsx
//   if (!filename.endsWith(".xlsx")) {
//     filename += ".xlsx";
//   }

//   // Write the file
//   XLSX.writeFile(wb, filename);
// }
function exportSpreadsheet() {
  const table = document.getElementById("spreadsheetTable");

  // Build array of arrays from the table
  const sheetData = [];
  for (let row of table.rows) {
    const rowData = [];
    for (let cell of row.cells) {
      // If cell has a dropdown, export the selected value
      const select = cell.querySelector("select");
      if (select) {
        rowData.push(select.options[select.selectedIndex]?.text || "");
      } else {
        rowData.push(cell.innerText.trim());
      }
    }
    sheetData.push(rowData);
  }

  // Convert array to worksheet
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Create a workbook and append sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Fight Sheet");

  // Ask user for filename
  let filename = prompt("Enter filename for export:", "fight_documentation.xlsx");
  if (!filename) return;

  if (!filename.endsWith(".xlsx")) {
    filename += ".xlsx";
  }

  XLSX.writeFile(wb, filename);
}



// function addRow() {
//   const table = document.getElementById("spreadsheetTable");
//   if (table.rows.length < 1) return; // no rows yet

//   // Insert a new row at the end
//   const newRow = table.insertRow();

//   // Get the last non-title row (so we don’t copy the header row formatting)
//   const templateRow = table.rows[table.rows.length - 2];

//   for (let c = 0; c < templateRow.cells.length; c++) {
//     const newCell = newRow.insertCell();

//     // Copy styles from the template cell
//     const templateCell = templateRow.cells[c];
//     newCell.className = templateCell.className;
//     newCell.style.cssText = templateCell.style.cssText;

//     // Keep it empty, but editable
//     newCell.innerText = "";
//   }
// }


// --- Dropdown option sets ---
const footworkOptions = ["", "Advance", "Retreat", "Cross Over Advance", "Cross Over Retreat", "Pass Forward", "Pass Back"];
const handOptions = ["", "Punch", "Block", "Parry", "Slash", "Thrust"];
const eOptions = ["", "←", "→", "←→", "→←"];

function createDropdown(options) {
    const select = document.createElement("select");
    options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        select.appendChild(o);
    });
    return select;
}

// function addRow() {
//   const table = document.getElementById("spreadsheetTable");
//   if (table.rows.length < 1) return;

//   const newRow = table.insertRow();
//   const colCount = table.rows[0].cells.length;

//   for (let c = 0; c < colCount; c++) {
//     const newCell = newRow.insertCell();
//     newCell.appendChild(createDropdown());
//   }
// }

function addRow() {
  const table = document.getElementById("spreadsheetTable");
  if (table.rows.length < 1) return; // no rows yet

  // Insert a new row at the end
  const newRow = table.insertRow();

  // Get the last non-title row (so we don’t copy the header row formatting)
  const templateRow = table.rows[table.rows.length - 2];

  for (let c = 0; c < templateRow.cells.length; c++) {
    const newCell = newRow.insertCell();

    // Copy styles from the template cell
    const templateCell = templateRow.cells[c];
    newCell.className = templateCell.className;
    newCell.style.cssText = templateCell.style.cssText;

    // If the template cell contains a dropdown, clone it
    const dropdown = templateCell.querySelector("select");
    if (dropdown) {
      const clone = dropdown.cloneNode(true); // deep copy
      clone.value = ""; // reset to blank
      newCell.appendChild(clone);
    } else {
      // fallback: just empty text cell
      newCell.innerText = "";
    }
  }
}



buildSpreadsheet();
