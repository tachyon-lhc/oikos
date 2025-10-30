// Exportar plano a JSON

function collectRoomData() {
  // Buscar TODOS los grupos en el canvas
  const allGroups = document.querySelectorAll("#canvas .rectangle-group");

  console.log("Total de grupos encontrados:", allGroups.length);

  // Contadores
  let bedrooms = 0;
  let bathrooms = 0;
  let guestroom = 0;

  // Detectar qué pisos tienen grupos dibujados
  const pisosDibujados = new Set();

  allGroups.forEach((group) => {
    const floor = parseInt(group.getAttribute("data-floor"));
    if (!isNaN(floor)) {
      pisosDibujados.add(floor);
    }
  });

  console.log("Pisos dibujados:", Array.from(pisosDibujados));

  // Basement = true si existe piso 0
  const basement = pisosDibujados.has(0) ? 1 : 0;

  // Stories = cantidad de pisos (excluyendo el 0/sótano)
  const stories = Array.from(pisosDibujados).filter((p) => p > 0).length;

  console.log("Basement detectado:", basement);
  console.log("Stories detectados:", stories);

  // Contar habitaciones (solo las válidas)
  allGroups.forEach((group) => {
    const rect = group.querySelector(".rectangle");
    if (!rect) return;

    const tipo = rect.getAttribute("data-tipo") || "sin-definir";
    const ancho = parseFloat(rect.getAttribute("width"));
    const alto = parseFloat(rect.getAttribute("height"));

    // Filtrar rectángulos inválidos
    if (ancho < 5 || alto < 5) return;

    // Contar tipos de habitaciones (total, sin importar el piso)
    if (tipo === "dormitorio") bedrooms++;
    if (tipo === "baño") bathrooms++;
    if (tipo === "hab-invitados") guestroom = 1;
  });

  // Obtener datos del formulario
  const area = parseInt(document.getElementById("area-metros").value) || 0;
  const parking = document.getElementById("parking").checked ? 1 : 0;
  const mainroad = document.getElementById("mainroad").checked ? "yes" : "no";
  const hotwaterheating = document.getElementById("hotwaterheating").checked
    ? "yes"
    : "no";
  const airconditioning = document.getElementById("airconditioning").checked
    ? "yes"
    : "no";
  const prefarea = document.getElementById("prefarea").checked ? "yes" : "no";
  const furnishingstatus = document.getElementById("furnishingstatus").value;

  return {
    area: area,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    stories: stories,
    mainroad: mainroad,
    guestroom: guestroom === 1 ? "yes" : "no",
    basement: basement === 1 ? "yes" : "no",
    hotwaterheating: hotwaterheating,
    airconditioning: airconditioning,
    parking: parking,
    prefarea: prefarea,
    furnishingstatus: furnishingstatus,
  };
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

  btnExport.addEventListener("click", () => {
    // Recolectar datos
    const data = collectRoomData();

    // Descargar JSON
    downloadJSON(data);

    console.log("JSON exportado:", data);
  });
}
