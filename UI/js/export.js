// Exportar plano a JSON

function collectRoomData() {
  // Obtener todos los grupos de rectángulos
  const groups = state.svg.querySelectorAll(".rectangle-group");

  const habitaciones = [];

  groups.forEach((group) => {
    const rect = group.querySelector(".rectangle");
    const tipo = rect.getAttribute("data-tipo") || "sin-definir";

    const x = parseFloat(rect.getAttribute("x"));
    const y = parseFloat(rect.getAttribute("y"));
    const ancho = parseFloat(rect.getAttribute("width"));
    const alto = parseFloat(rect.getAttribute("height"));

    habitaciones.push({
      tipo: tipo,
      x: x,
      y: y,
      ancho: ancho,
      alto: alto,
    });
  });

  return { habitaciones };
}

function downloadJSON(data, filename = "plano.json") {
  // Convertir objeto a JSON string
  const jsonStr = JSON.stringify(data, null, 2);

  // Crear blob
  const blob = new Blob([jsonStr], { type: "application/json" });

  // Crear URL temporal
  const url = URL.createObjectURL(blob);

  // Crear enlace temporal y simular click
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Limpiar
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function initExport() {
  const btnExport = document.getElementById("btn-est-exp");

  btnExport.addEventListener("change", () => {
    if (btnExport.checked) {
      // Recolectar datos
      const data = collectRoomData();

      // Descargar JSON
      downloadJSON(data);

      // Desmarcar el checkbox
      btnExport.checked = false;

      console.log("JSON exportado:", data);
    }
  });
}
