// TEST
function exportToExcel() {
  let data = [
    ["Option", "Value"],
    ["Choice 1", document.getElementById("option1").value]
  ];
  
  let csv = data.map(row => row.join(",")).join("\n");
  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  
  let a = document.createElement("a");
  a.href = url;
  a.download = "export.csv";
  a.click();
}

// Updates fighter dropdowns when number of fighters changes
function updateFighterDropdowns() {
  const num = document.getElementById("numFighters").value;
  const container = document.getElementById("fighterOptions");
  container.innerHTML = "";

  for (let i = 1; i <= num; i++) {
    const label = document.createElement("label");
    label.className = "fighter-label";
    label.textContent = `Fighter ${i}`;

    const select = document.createElement("select");
    select.innerHTML = `
      <option value="Option1">Option 1</option>
      <option value="Option2">Option 2</option>
      <option value="Option3">Option 3</option>
    `;

    container.appendChild(label);
    container.appendChild(select);
  }
}

// Placeholder for import functionality
function importSpreadsheet() {
  alert("Import functionality not implemented yet.");
}

// Placeholder for moving to spreadsheet view
function goToSpreadsheet() {
  alert("Go button clicked! This will show the spreadsheet view.");
}

// Initialize defaults
updateFighterDropdowns();

