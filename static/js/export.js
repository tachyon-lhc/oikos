// =============================
// Exportar plano a JSON
// =============================
function collectRoomData() {
  // Buscar TODOS los grupos en el canvas
  const allGroups = document.querySelectorAll("#canvas .rectangle-group");
  console.log("Total de grupos encontrados:", allGroups.length);

  // Contadores
  let rooms = 0; // Ambientes habitables
  let bathrooms = 0;

  // Tipos que cuentan como "ambientes" en Argentina
  const ambientesValidos = [
    "dormitorio",
    "cocina",
    "sala",
    "comedor",
    "hab-invitados",
  ];

  // Contar habitaciones (solo las válidas)
  allGroups.forEach((group) => {
    const rect = group.querySelector(".rectangle");
    if (!rect) return;

    const tipo = rect.getAttribute("data-tipo") || "sin-definir";
    const ancho = parseFloat(rect.getAttribute("width"));
    const alto = parseFloat(rect.getAttribute("height"));

    // Filtrar rectángulos inválidos
    if (ancho < 5 || alto < 5) return;

    // Contar ambientes (espacios habitables principales)
    if (ambientesValidos.includes(tipo)) {
      rooms++;
    }

    // Contar baños (no cuentan como ambientes)
    if (tipo === "baño") {
      bathrooms++;
    }
  });

  // Obtener datos del formulario
  const area = parseInt(document.getElementById("area-metros").value) || 0;
  const region = document.getElementById("region-select").value || "";
  const localidad = document.getElementById("localidad-select").value || "";

  // Combinar ubicación completa
  const location = localidad && region ? `${region} - ${localidad}` : "";

  console.log(`Ambientes contados: ${rooms} (${ambientesValidos.join(", ")})`);
  console.log(`Baños contados: ${bathrooms}`);

  return {
    rooms,
    bathrooms,
    area,
    location,
    region,
    localidad,
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

    // Validar que se hayan completado los campos obligatorios
    if (!data.area) {
      alert("⚠️ Por favor ingresa el área en metros cuadrados");
      return;
    }

    if (!data.location) {
      alert("⚠️ Por favor selecciona la región y localidad");
      return;
    }

    if (data.rooms === 0) {
      alert("⚠️ Por favor dibuja al menos un ambiente en el plano");
      return;
    }

    console.log("Enviando datos a Flask:", data);

    // Cambiar texto del botón mientras espera
    btnExport.textContent = "Calculando...";
    btnExport.disabled = true;

    // 🔥 Detectar entorno: local o Render
    const API_URL =
      window.location.hostname === "localhost"
        ? "http://localhost:5000/predict"
        : `${window.location.origin}/predict`;

    console.log("Usando endpoint:", API_URL);

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
