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
let dropdownCounter = 0;
function createDropdown(options) {
  dropdownCounter++;
  const listId = "dropdownList_" + dropdownCounter;

  const input = document.createElement("input");
  input.setAttribute("list", listId);
  input.className = "cell-dropdown";
  input.autocomplete = "off";
  input.value = "";

  const datalist = document.createElement("datalist");
  datalist.id = listId;
  options.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt;
    datalist.appendChild(o);
  });

  const wrapper = document.createElement("div");
  wrapper.className = "dropdown-wrapper";
  wrapper.appendChild(input);
  wrapper.appendChild(datalist);

  return wrapper;
} // **************************************************************************************


/* 
Constructs the table based on the selected configuration/fighter options
*/
function buildSpreadsheet() {
  const table = document.getElementById("spreadsheetTable");
  table.removeAttribute("contenteditable");
  table.contentEditable = "false";

  const title = localStorage.getItem("fightTitle") || "Demo Fight";
  const numFighters = parseInt(localStorage.getItem("numFighters")) || 2;
  const fighterOptions = JSON.parse(localStorage.getItem("fighterOptions")) || [2, 2];
  const author = localStorage.getItem("author") || "Unknown";
  const dateStr = new Date().toLocaleDateString();

  table.innerHTML = "";

  // --- Compute total columns (fighters + {e}) ---
  let totalCols = 0;
  if (numFighters === 2) {
    totalCols = fighterOptions.reduce((a, b) => a + b + 1, 0) + 1; // +1 shared {e}
  } else {
    totalCols = fighterOptions.reduce((a, b) => a + b + 2, 0); // footwork + {e} + hands
  }

  // Add 2 extra columns: Row # (left) and Notes (right)
  totalCols += 2;

  // --- Row 1: Author | Title | Date ---
  const headerRow = table.insertRow();
  const authorCell = headerRow.insertCell();
  authorCell.innerText = `Author(s): ${author}`;
  authorCell.style.textAlign = "left";
  authorCell.style.borderBottom = "2px solid black";
  authorCell.style.padding = "8px";
  authorCell.contentEditable = "true";

  const titleCell = headerRow.insertCell();
  titleCell.colSpan = totalCols - 2;
  titleCell.innerHTML = `<strong>${title}</strong>`;
  titleCell.style.textAlign = "center";
  titleCell.style.borderBottom = "2px solid black";
  titleCell.style.padding = "8px";
  titleCell.contentEditable = "true";

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

  // Leftmost "#"
  const numHead = fighterRow.insertCell();
  numHead.rowSpan = 2;
  numHead.innerText = "#";
  numHead.style.border = "2px solid black";
  numHead.style.textAlign = "center";
  numHead.style.width = "30px";

  if (numFighters === 2) {
    const f1 = fighterRow.insertCell();
    f1.colSpan = fighterOptions[0] + 1;
    f1.innerText = "Combatant 1";
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
    f2.innerText = "Combatant 2";
    f2.style.border = "2px solid black";
    f2.style.textAlign = "center";
    f2.contentEditable = "true";
  } else {
    for (let i = 0; i < numFighters; i++) {
      const f = fighterRow.insertCell();
      f.colSpan = fighterOptions[i] + 2;
      f.innerText = `Combatant ${i + 1}`;
      f.style.border = "2px solid black";
      f.style.textAlign = "center";
      f.contentEditable = "true";
    }
  }

  // Rightmost "Notes"
  const notesHead = fighterRow.insertCell();
  notesHead.rowSpan = 2;
  notesHead.innerText = "Notes";
  notesHead.style.border = "2px solid black";
  notesHead.style.textAlign = "center";
  notesHead.style.width = "200px";

  // --- Sub-header row ---
  const subHeaderRow = table.insertRow();
  const colTypes = [];

  // Add rowNum as first col type
  colTypes.push("rowNum");

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

    colTypes.push("e");

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

  // Append notes col type last
  colTypes.push("notes");

  // --- Example blank rows ---
  for (let r = 0; r < 10; r++) {
    const row = table.insertRow();
    for (let c = 0; c < totalCols; c++) {
      const cell = row.insertCell();
      cell.style.border = "1px solid gray";
      cell.style.padding = "4px";
      cell.contentEditable = "false";

      if (colTypes[c] === "rowNum") {
        cell.innerText = r + 1;
        cell.style.textAlign = "center";
        cell.style.fontWeight = "bold";
      } else if (colTypes[c] === "footwork") {
        const wrapper = createDropdown(footworkOptions);
        wrapper.querySelector("input[list]").style.width = "100%";
        cell.appendChild(wrapper);
      } else if (colTypes[c] === "hand") {
        const wrapper = createDropdown(handOptions);
        wrapper.querySelector("input[list]").style.width = "100%";
        cell.appendChild(wrapper);
      } else if (colTypes[c] === "e") {
        const wrapper = createDropdown(eOptions);
        wrapper.querySelector("input[list]").style.width = "100%";
        cell.appendChild(wrapper);
      } else if (colTypes[c] === "notes") {
        cell.contentEditable = "true";
      }
    }
  }
} // **************************************************************************************

/* 
Exports the table to an excel (.xlsx) file
*/
async function exportSpreadsheet() {
  const table = document.getElementById("spreadsheetTable");
  if (!table) {
    alert("Spreadsheet table not found.");
    return;
  }

  // --- filename from title cell (robust) ---
  let fightTitle = "Fight";
  if (table.rows.length > 0) {
    const headerRow = table.rows[0];
    // prefer a <strong> title cell, otherwise fall back to middle cell
    let found = false;
    for (let i = 0; i < headerRow.cells.length; i++) {
      const hc = headerRow.cells[i];
      if (hc.querySelector && hc.querySelector("strong")) {
        fightTitle = hc.innerText.trim() || fightTitle;
        found = true;
        break;
      }
    }
    if (!found) {
      const mid = Math.floor(headerRow.cells.length / 2);
      fightTitle = (headerRow.cells[mid] && headerRow.cells[mid].innerText.trim()) || fightTitle;
    }
  }
  fightTitle = fightTitle.replace(/[^a-z0-9_\-]/gi, "_");
  let filename = prompt("Enter filename for export:", `SPAR_${fightTitle}.xlsx`);
  if (!filename) return;
  if (!filename.endsWith(".xlsx")) filename += ".xlsx";

  // --- ExcelJS workbook/sheet (ExcelJS must be loaded before this script) ---
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Fight Sheet");

  // occupied map for cells already covered by a rowspan/colspan merge
  const occupied = {}; // keys like "row,col" set to true

  for (let r = 0; r < table.rows.length; r++) {
    const htmlRow = table.rows[r];
    const sheetRow = sheet.getRow(r + 1);

    // excel column pointer for this DOM row (1-based)
    let excelCol = 1;

    for (let j = 0; j < htmlRow.cells.length; j++) {
      // skip columns already occupied by previous merges
      while (occupied[`${r + 1},${excelCol}`]) excelCol++;

      const htmlCell = htmlRow.cells[j];
      const startRow = r + 1;
      const startCol = excelCol;
      const colspan = htmlCell.colSpan || 1;
      const rowspan = htmlCell.rowSpan || 1;
      const excelCell = sheetRow.getCell(startCol);

      // --- value (input[list], select, or plain text) ---
      let value = "";
      const input = htmlCell.querySelector("input[list]");
      if (input) {
        value = input.value.trim();
      } else {
        const select = htmlCell.querySelector("select");
        value = select ? (select.options[select.selectedIndex]?.text || "") : htmlCell.innerText.trim();
      }
      excelCell.value = value;

      // --- styles (font / fill / alignment) ---
      const style = window.getComputedStyle(htmlCell);
      // alignment
      excelCell.alignment = {
        horizontal: (style.textAlign && style.textAlign !== "" ? style.textAlign : "center"),
        vertical: "middle",
        wrapText: true
      };

      // font
      const fontObj = { ...(excelCell.font || {}) };
      if (style.fontWeight === "700" || style.fontWeight === "bold") fontObj.bold = true;
      if (style.textDecoration && style.textDecoration.includes("underline")) fontObj.underline = true;
      if (style.color && !style.color.includes("transparent")) {
        try { fontObj.color = { argb: rgbToHex(style.color) }; } catch (e) {}
      }
      if (Object.keys(fontObj).length) excelCell.font = fontObj;

      // fill (background)
      if (style.backgroundColor && !style.backgroundColor.includes("transparent") && !style.backgroundColor.includes("rgba(0, 0, 0, 0)")) {
        try {
          excelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: rgbToHex(style.backgroundColor) }
          };
        } catch (e) {}
      }

      // borders (thin grid)
      excelCell.border = {
        top:    { style: "thin", color: { argb: "FF000000" } },
        left:   { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right:  { style: "thin", color: { argb: "FF000000" } }
      };

      // --- merges ---
      if (colspan > 1 || rowspan > 1) {
        const endRow = startRow + rowspan - 1;
        const endCol = startCol + colspan - 1;
        sheet.mergeCells(startRow, startCol, endRow, endCol);

        // mark spanned cells as occupied (so subsequent DOM cells won't be placed into those coords)
        for (let rr = startRow; rr <= endRow; rr++) {
          for (let cc = startCol; cc <= endCol; cc++) {
            if (!(rr === startRow && cc === startCol)) occupied[`${rr},${cc}`] = true;
          }
        }
      }

      // advance excelCol by the logical width of this HTML cell
      excelCol += colspan;
    } // end cells loop
  } // end rows loop

  // --- final write and download ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
} 

// helper: rgb()/rgba() -> ARGB hex (robust)
function rgbToHex(rgb) {
  if (!rgb) return "FF000000";
  const m = rgb.match(/\d+/g);
  if (!m) return "FF000000";
  const r = Number(m[0]), g = Number(m[1]), b = Number(m[2]);
  return ("FF" + [r,g,b].map(x => x.toString(16).padStart(2, "0")).join("")).toUpperCase();
} // **************************************************************************************

/*
Adds a BLANK row to the bottom of the table with the same formatting as the previous bottom row
*/
// ---------- helpers ----------
function findSubHeaderIndex(table) {
  for (let i = 0; i < table.rows.length; i++) {
    for (const cell of table.rows[i].cells) {
      const t = (cell.textContent || "").trim();
      if (/^Footwork$/i.test(t) || /^Hand\s*\d+/i.test(t) || t === "{e}") return i;
    }
  }
  return -1;
}

function getColTypes(table) {
  // returns full column types array: ['rowNum', ...middleCols..., 'notes']
  const subIdx = findSubHeaderIndex(table);
  if (subIdx === -1) return []; // fail safe

  const subRow = table.rows[subIdx];
  const middle = [];
  for (let i = 0; i < subRow.cells.length; i++) {
    const txt = (subRow.cells[i].textContent || "").trim();
    if (txt === "" || txt === "{e}") {
      middle.push("e");
    } else if (/^Footwork$/i.test(txt)) {
      middle.push("footwork");
    } else if (/^Hand\s*\d+/i.test(txt)) {
      middle.push("hand");
    } else {
      // unknown: keep blank cell
      middle.push("unknown");
    }
  }
  return ["rowNum", ...middle, "notes"];
}

function renumberMoves(table) {
  const subIdx = findSubHeaderIndex(table);
  if (subIdx === -1) return;

  // data rows begin AFTER the subheader row
  let move = 1;
  for (let r = subIdx + 2; r < table.rows.length; r++) {
    const firstCell = table.rows[r].cells[0];
    if (!firstCell) continue;

    const txt = (firstCell.textContent || "").trim();
    if (txt === "BREAK") {
      // skip numbering BREAK rows
      continue;
    } else {
      firstCell.textContent = move;
      move++;
    }
  }
}

// ---------- new addRow ----------
function addRow() {
  const table = document.getElementById("spreadsheetTable");
  if (table.rows.length < 1) return;

  // Find the last non-BREAK row after the subheader
  let templateRowIndex = -1;
  for (let i = table.rows.length - 1; i >= 0; i--) {
    const firstCell = table.rows[i].cells[0];
    if (firstCell && firstCell.textContent.trim() !== "BREAK") {
      templateRowIndex = i;
      break;
    }
  }
  if (templateRowIndex === -1) return; // no valid template row

  const templateRow = table.rows[templateRowIndex];
  const newRow = table.insertRow();

  for (let c = 0; c < templateRow.cells.length; c++) {
    const newCell = newRow.insertCell();
    const templateCell = templateRow.cells[c];

    newCell.style.cssText = templateCell.style.cssText || "";
    newCell.contentEditable = "false";

    // --- First column = row number ---
    if (c === 0) {
      newCell.innerText = ""; // will be set by renumberMoves
      newCell.style.textAlign = "center";
      continue;
    }

    // --- Notes column (last col) ---
    if (c === templateRow.cells.length - 1) {
      newCell.contentEditable = "true";
      newCell.innerText = "";
      continue;
    }

    // --- Dropdown columns ---
    const templateInput = templateCell.querySelector("input[list]");
    if (templateInput) {
      const listId = templateInput.getAttribute("list");
      const datalist = document.getElementById(listId);
      const options = datalist ? Array.from(datalist.options).map(o => o.value) : [];
      const wrapper = createDropdown(options);
      const input = wrapper.querySelector("input[list]");
      if (input) {
        input.style.width = "100%";
        input.style.boxSizing = "border-box";
      }
      newCell.appendChild(wrapper);
      continue;
    }

    // Legacy <select>
    const templateSelect = templateCell.querySelector("select");
    if (templateSelect) {
      const clone = templateSelect.cloneNode(true);
      clone.value = "";
      newCell.appendChild(clone);
      continue;
    }

    // fallback
    newCell.innerText = "";
  }

  // Fix move numbering
  renumberMoves(table);
}

// ---------- new addBreak ----------
function addBreak() {
  const table = document.getElementById("spreadsheetTable");
  if (!table || table.rows.length < 1) return;

  const colTypes = getColTypes(table);
  if (!colTypes || colTypes.length === 0) return;

  // Step 1: append a proper blank choreography row (so subsequent addRow continues normally)
  addRow();

  // Step 2: insert BREAK row immediately before that newly added row
  const insertIndex = table.rows.length - 1; // before last row
  const breakRow = table.insertRow(insertIndex);

  for (let c = 0; c < colTypes.length; c++) {
    const type = colTypes[c];
    const cell = breakRow.insertCell();
    cell.style.border = "1px solid #aaa";
    cell.style.padding = "4px";
    cell.style.backgroundColor = "#ddd";
    cell.contentEditable = "false";

    if (type === "rowNum") {
      cell.textContent = "BREAK";
      cell.style.textAlign = "center";
      cell.style.fontWeight = "bold";
    } else if (type === "notes") {
      cell.contentEditable = "true";
      cell.textContent = "";
    } else {
      cell.textContent = "";
    }
  }

  // finally, renumber moves (BREAK rows are ignored)
  renumberMoves(table);
} // **************************************************************************************

/* 
build the spreadsheet only after the options are loaded and DOM is ready
*/
document.addEventListener("DOMContentLoaded", async () => {
  await loadOptions();      // wait for .txt files (or fallback)
  buildSpreadsheet();       // now safe to build the table with loaded options
}); // **************************************************************************************

