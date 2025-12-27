// =============================
// Modal de Resultado
// =============================
function createPriceModal() {
  // Crear el modal si no existe
  if (document.getElementById("price-modal")) return;

  const modalHTML = `
    <div id="price-modal" class="modal-overlay">
      <div class="modal-container">
        <button class="modal-close" onclick="closePriceModal()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-content">
          <div class="modal-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          
          <h2 class="modal-title">Estimate completed</h2>
          
          <div class="modal-price-container">
            <span class="modal-price-label">Estimated price</span>
            <span class="modal-price" id="modal-price-value">$0</span>
          </div>
          
          <div class="modal-details" id="modal-details">
            <!-- Detalles opcionales -->
          </div>
          
          <div class="modal-actions">
            <button class="btn-secondary" onclick="closePriceModal()">Close</button>
            <button class="btn-primary" onclick="resetCanvas()">New house</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Agregar estilos
  const styles = `
    <style>
      .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 9999;
        animation: fadeIn 0.3s ease;
      }
      
      .modal-overlay.active {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-container {
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 480px;
        width: 90%;
        position: relative;
        animation: slideUp 0.4s ease;
        overflow: hidden;
      }
      
      .modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.2s;
        z-index: 10;
      }
      
      .modal-close:hover {
        background: #f0f0f0;
        color: #333;
      }
      
      .modal-content {
        padding: 48px 32px 32px;
        text-align: center;
      }
      
      .modal-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      
      .modal-title {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0 0 24px;
      }
      
      .modal-price-container {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 24px;
        border-radius: 12px;
        margin: 0 0 24px;
      }
      
      .modal-price-label {
        display: block;
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .modal-price {
        display: block;
        font-size: 42px;
        font-weight: 800;
        color: #667eea;
        line-height: 1;
      }
      
      .modal-details {
        text-align: left;
        background: #f9fafb;
        padding: 16px;
        border-radius: 8px;
        margin: 0 0 24px;
        font-size: 14px;
        color: #666;
      }
      
      .modal-details p {
        margin: 8px 0;
        display: flex;
        justify-content: space-between;
      }
      
      .modal-details strong {
        color: #333;
      }
      
      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      
      .btn-primary, .btn-secondary {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
        flex: 1;
        max-width: 180px;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
      }
      
      .btn-secondary {
        background: white;
        color: #666;
        border: 2px solid #e0e0e0;
      }
      
      .btn-secondary:hover {
        background: #f5f5f5;
        border-color: #ccc;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  `;

  document.head.insertAdjacentHTML("beforeend", styles);
}

// Función para mostrar el modal con el precio
function showPriceModal(price, details = {}) {
  createPriceModal();

  const modal = document.getElementById("price-modal");
  const priceElement = document.getElementById("modal-price-value");
  const detailsElement = document.getElementById("modal-details");

  // Actualizar precio
  priceElement.textContent = price;

  // Mostrar detalles opcionales
  if (Object.keys(details).length > 0) {
    let detailsHTML = "";
    if (details.rooms)
      detailsHTML += `<p><span>Rooms:</span> <strong>${details.rooms}</strong></p>`;
    if (details.bathrooms)
      detailsHTML += `<p><span>Bathrooms:</span> <strong>${details.bathrooms}</strong></p>`;
    if (details.area)
      detailsHTML += `<p><span>Area:</span> <strong>${details.area} m²</strong></p>`;
    if (details.location)
      detailsHTML += `<p><span>Location:</span> <strong>${details.location}</strong></p>`;

    detailsElement.innerHTML = detailsHTML;
    detailsElement.style.display = "block";
  } else {
    detailsElement.style.display = "none";
  }

  // Mostrar modal
  modal.classList.add("active");

  // Cerrar con ESC
  document.addEventListener("keydown", handleEscKey);
}

// Función para cerrar el modal
function closePriceModal() {
  const modal = document.getElementById("price-modal");
  modal.classList.remove("active");
  document.removeEventListener("keydown", handleEscKey);
}

// Cerrar con tecla ESC
function handleEscKey(e) {
  if (e.key === "Escape") {
    closePriceModal();
  }
}

// Función para resetear el canvas
function resetCanvas() {
  if (confirm("Are you sure you want to delete the entire blueprint?")) {
    const canvas = document.getElementById("canvas");
    // Limpiar todos los grupos de rectángulos
    canvas
      .querySelectorAll(".rectangle-group")
      .forEach((group) => group.remove());

    // Resetear formulario
    document.getElementById("area-metros").value = "";
    document.getElementById("region-select").value = "";
    document.getElementById("localidad-select").value = "";

    closePriceModal();
  }
}

// =============================
// Exportar plano a JSON
// =============================
function collectRoomData() {
  const allGroups = document.querySelectorAll("#canvas .rectangle-group");
  console.log("Total de grupos encontrados:", allGroups.length);

  let rooms = 0;
  let bathrooms = 0;

  const ambientesValidos = [
    "bedroom",
    "kitchen",
    "hall",
    "dining-room",
    "guestroom",
  ];

  allGroups.forEach((group) => {
    const rect = group.querySelector(".rectangle");
    if (!rect) return;

    const tipo = rect.getAttribute("data-tipo") || "sin-definir";
    const ancho = parseFloat(rect.getAttribute("width"));
    const alto = parseFloat(rect.getAttribute("height"));

    if (ancho < 5 || alto < 5) return;

    if (ambientesValidos.includes(tipo)) {
      rooms++;
    }

    if (tipo === "bathroom") {
      bathrooms++;
    }
  });

  const area = parseInt(document.getElementById("area-metros").value) || 0;
  const region = document.getElementById("region-select").value || "";
  const localidad = document.getElementById("localidad-select").value || "";
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
    const data = collectRoomData();

    // Validaciones
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

    btnExport.textContent = "Calculando...";
    btnExport.disabled = true;

    const API_URL =
      window.location.hostname === "localhost"
        ? "http://localhost:5000/predict"
        : `${window.location.origin}/predict`;

    console.log("Usando endpoint:", API_URL);

    try {
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

      // 🎉 Mostrar modal en lugar de alert
      showPriceModal(result.formatted_price, {
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        area: data.area,
        location: data.location,
      });
    } catch (error) {
      console.error("Error al conectar con Flask:", error);
      alert(
        "❌ Error al calcular el precio.\nAsegúrate de que el servidor Flask esté corriendo si estás en local.",
      );
    } finally {
      btnExport.textContent = "Calcular valor";
      btnExport.disabled = false;
    }
  });
}

// Inicializar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", initExport);
