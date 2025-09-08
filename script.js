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

function goToSpreadsheet() {
  // Hide setup
  document.getElementById("setup").style.display = "none";
  // Show spreadsheet section
  document.getElementById("spreadsheet").style.display = "block";

  // Example: generate a simple table from dropdown
  let choice = document.getElementById("option1").value;
  let table = document.getElementById("table");
  table.innerHTML = `
    <tr><th>Option</th><th>Value</th></tr>
    <tr><td>Choice 1</td><td>${choice}</td></tr>
  `;
}
