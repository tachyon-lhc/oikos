// =============================
// Exportar plano a JSON
// =============================
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
    if (!isNaN(floor)) pisosDibujados.add(floor);
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
    area,
    bedrooms,
    bathrooms,
    stories,
    mainroad,
    guestroom: guestroom === 1 ? "yes" : "no",
    basement: basement === 1 ? "yes" : "no",
    hotwaterheating,
    airconditioning,
    parking,
    prefarea,
    furnishingstatus,
  };
}

// =============================
// Inicializar Exportación
// =============================
function initExport() {
  const btnExport = document.getElementById("btn-est-exp");

  btnExport.addEventListener("click", async () => {
    // Recolectar datos
    const data = collectRoomData();
    console.log("Enviando datos a Flask:", data);

    // Cambiar texto del botón mientras espera
    btnExport.textContent = "Calculando...";
    btnExport.disabled = true;

    // 🔥 Detectar entorno: local o Render
    const API_URL =
      window.location.hostname === "localhost"
        ? "http://localhost:5000/predict"
        : "https://oikos-backend.onrender.com/predict";
    try {
      // Enviar a Flask
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Respuesta de Flask:", result);

      // Mostrar resultado al usuario
      alert(`💰 Precio estimado: ${result.formatted_price}`);
    } catch (error) {
      console.error("Error al conectar con Flask:", error);
      alert(
        "❌ Error al calcular el precio.\nAsegúrate de que el servidor Flask esté corriendo si estás en local.",
      );
    } finally {
      // Restaurar botón
      btnExport.textContent = "Calcular valor";
      btnExport.disabled = false;
    }
  });
}
