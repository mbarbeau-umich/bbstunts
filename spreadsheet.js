// function buildSpreadsheet() {
//   const table = document.getElementById("spreadsheetTable");

//   const title = localStorage.getItem("fightTitle") || "Demo Fight";
//   const numFighters = parseInt(localStorage.getItem("numFighters")) || 2;
//   const fighterOptions = JSON.parse(localStorage.getItem("fighterOptions")) || [2, 2];
//   const author = localStorage.getItem("author") || "Unknown";

//   table.innerHTML = "";

//   // Title row
//   const titleRow = table.insertRow();
//   const titleCell = titleRow.insertCell();

//   // compute colSpan dynamically (we'll adjust for {e} below)
//   let colCount = 0;
//   if (numFighters === 2) {
//     // sum of footwork+hands for both fighters, plus 1 shared {e}
//     colCount = fighterOptions.reduce((a, b) => a + b + 1, 0) + 1;
//   } else {
//     // for each fighter: footwork + hands + {e}
//     colCount = fighterOptions.reduce((a, b) => a + b + 2, 0);
//   }

//   titleCell.colSpan = colCount;
//   titleCell.innerText = title;
//   titleCell.className = "table-title";

//   // Author + Date row
//   const metaRow = table.insertRow();
//   const leftCols = Math.floor(titleCell.colSpan / 2);
//   const rightCols = titleCell.colSpan - leftCols;

//   const authorCell = metaRow.insertCell();
//   authorCell.colSpan = leftCols;
//   authorCell.innerText = "Author(s): " + author;

//   const dateCell = metaRow.insertCell();
//   dateCell.colSpan = rightCols;
//   dateCell.innerText = "Date: " + new Date().toLocaleDateString();

//   // Fighter headers
//   const fighterRow = table.insertRow();
//   if (numFighters === 2) {
//     // Fighter 1 header
//     const f1 = fighterRow.insertCell();
//     f1.colSpan = fighterOptions[0] + 1; // footwork + hands
//     f1.innerText = "Fighter 1";

//     // Shared {e} header
//     const shared = fighterRow.insertCell();
//     shared.rowSpan = 2; // span down into subheader row
//     shared.innerText = "{e}";

//     // Fighter 2 header
//     const f2 = fighterRow.insertCell();
//     f2.colSpan = fighterOptions[1] + 1;
//     f2.innerText = "Fighter 2";
//   } else {
//     // Each fighter has footwork + hands + {e}
//     for (let i = 0; i < numFighters; i++) {
//       const f = fighterRow.insertCell();
//       f.colSpan = fighterOptions[i] + 2; // footwork + hands + {e}
//       f.innerText = `Fighter ${i + 1}`;
//     }
//   }

//   // Sub-headers
//   const headerRow = table.insertRow();
//   if (numFighters === 2) {
//     // Fighter 1 subheaders
//     const cols1 = ["Footwork"];
//     for (let h = 1; h <= fighterOptions[0]; h++) {
//       cols1.push("Hand " + h);
//     }
//     cols1.forEach((c) => {
//       const cell = headerRow.insertCell();
//       cell.innerText = c;
//     });

//     // skip {e}, already inserted above with rowSpan

//     // Fighter 2 subheaders
//     const cols2 = ["Footwork"];
//     for (let h = 1; h <= fighterOptions[1]; h++) {
//       cols2.push("Hand " + h);
//     }
//     cols2.forEach((c) => {
//       const cell = headerRow.insertCell();
//       cell.innerText = c;
//     });
//   } else {
//     // 3+ fighters: each gets Footwork + {e} + hands
//     fighterOptions.forEach((hands) => {
//       const cols = ["Footwork", "{e}"];
//       for (let h = 1; h <= hands; h++) {
//         cols.push("Hand " + h);
//       }
//       cols.forEach((c) => {
//         const cell = headerRow.insertCell();
//         cell.innerText = c;
//       });
//     });
//   }

//   // Example blank rows
//   for (let r = 0; r < 10; r++) {
//     const row = table.insertRow();
//     for (let c = 0; c < titleCell.colSpan; c++) {
//       row.insertCell().innerText = "";
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
    totalCols = fighterOptions.reduce((a, b) => a + b + 1, 0) + 1; // +1 for shared {e}
  } else {
    totalCols = fighterOptions.reduce((a, b) => a + b + 2, 0); // +1 {e} per fighter
  }

  // --- Row 1: Title, Author, Date all in same row ---
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
    // Fighter 1
    const f1 = fighterRow.insertCell();
    f1.colSpan = fighterOptions[0] + 1; // footwork + hands
    f1.innerText = "Fighter 1";
    f1.style.border = "2px solid black";
    f1.style.textAlign = "center";

    // Shared {e}
    const eCell = fighterRow.insertCell();
    eCell.rowSpan = 2;
    eCell.innerText = "{e}";
    eCell.style.border = "2px solid black";
    eCell.style.textAlign = "center";

    // Fighter 2
    const f2 = fighterRow.insertCell();
    f2.colSpan = fighterOptions[1] + 1;
    f2.innerText = "Fighter 2";
    f2.style.border = "2px solid black";
    f2.style.textAlign = "center";
  } else {
    // 3+ fighters
    for (let i = 0; i < numFighters; i++) {
      const f = fighterRow.insertCell();
      f.colSpan = fighterOptions[i] + 2; // footwork + {e} + hands
      f.innerText = `Fighter ${i + 1}`;
      f.style.border = "2px solid black";
      f.style.textAlign = "center";
    }
  }

  // --- Sub-header row (Footwork / {e} / Hands) ---
  const subHeaderRow = table.insertRow();
  if (numFighters === 2) {
    // Fighter 1 subheaders
    ["Footwork", ...Array.from({length: fighterOptions[0]}, (_, i) => `Hand ${i+1}`)]
      .forEach(c => {
        const cell = subHeaderRow.insertCell();
        cell.innerText = c;
        cell.style.border = "1px solid gray";
        cell.style.textAlign = "center";
      });

    // skip {e} (rowSpan covers it)

    // Fighter 2 subheaders
    ["Footwork", ...Array.from({length: fighterOptions[1]}, (_, i) => `Hand ${i+1}`)]
      .forEach(c => {
        const cell = subHeaderRow.insertCell();
        cell.innerText = c;
        cell.style.border = "1px solid gray";
        cell.style.textAlign = "center";
      });
  } else {
    // 3+ fighters
    fighterOptions.forEach(hands => {
      ["Footwork", "{e}", ...Array.from({length: hands}, (_, i) => `Hand ${i+1}`)]
        .forEach(c => {
          const cell = subHeaderRow.insertCell();
          cell.innerText = c;
          cell.style.border = "1px solid gray";
          cell.style.textAlign = "center";
        });
    });
  }

  // --- Example blank rows ---
  for (let r = 0; r < 10; r++) {
    const row = table.insertRow();
    for (let c = 0; c < totalCols; c++) {
      const cell = row.insertCell();
      cell.innerText = "";
      cell.style.border = "1px solid gray";
    }
  }
}



// function exportSpreadsheet() {
//   const table = document.getElementById("spreadsheetTable");
//   const wb = XLSX.utils.table_to_book(table, { sheet: "Fight Sheet" });
//   XLSX.writeFile(wb, "fight_documentation.xlsx");
// }

function exportSpreadsheet() {
  const table = document.getElementById("spreadsheetTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Fight Sheet" });

  // Ask user for filename
  let filename = prompt("Enter filename for export:", "fight_documentation.xlsx");

  if (!filename) {
    // User canceled
    return;
  }

  // Ensure it ends with .xlsx
  if (!filename.endsWith(".xlsx")) {
    filename += ".xlsx";
  }

  // Write the file
  XLSX.writeFile(wb, filename);
}


buildSpreadsheet();
