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
