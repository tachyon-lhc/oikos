// Datos de ubicaciones
// value: lo que se envía al servidor (debe coincidir con los encoders)
// label: lo que ve el usuario
const UBICACIONES = {
  "GBA Norte": [
    { value: "pilar", label: "Pilar" },
    { value: "escobar", label: "Escobar" },
    { value: "tigre", label: "Tigre" },
    { value: "san-isidro", label: "San Isidro" },
    { value: "san-miguel", label: "San Miguel" },
    { value: "general-san-martin", label: "General San Martin" },
    { value: "vicente-lopez", label: "Vicente Lopez" },
    { value: "malvinas-argentina", label: "Malvinas Argentina" },
    { value: "san-fernando", label: "San Fernando" },
  ],
  "GBA Oeste": [
    { value: "la-matanza", label: "La Matanza" },
    { value: "moron", label: "Moron" },
    { value: "ituzaingo", label: "Ituzaingo" },
    { value: "moreno", label: "Moreno" },
    { value: "merlo", label: "Merlo" },
    { value: "castelar", label: "Castelar" },
    { value: "tres-de-febrero", label: "Tres de Febrero" },
    { value: "hurlingham", label: "Hurlingham" },
  ],
  "GBA Sur": [
    { value: "la-plata", label: "La Plata" },
    { value: "esteban-echeverria", label: "Esteban Echeverria" },
    { value: "quilmes", label: "Quilmes" },
    { value: "lomas-de-zamora", label: "Lomas de Zamora" },
    { value: "ezeiza", label: "Ezeiza" },
    { value: "berazategui", label: "Berazategui" },
    { value: "lanus", label: "Lanus" },
    { value: "almirante-brown", label: "Almirante Brown" },
    { value: "avellaneda", label: "Avellaneda" },
  ],
  Córdoba: [
    { value: "cordoba", label: "Córdoba" },
    { value: "punilla", label: "Punilla" },
    { value: "colon", label: "Colon" },
    { value: "villa-carlos-paz", label: "Villa Carlos Paz" },
    { value: "santa-maria", label: "Santa Maria" },
  ],
  "Costa Atlántica": [
    { value: "mar-del-plata", label: "Mar del Plata" },
    { value: "costa-esmeralda", label: "Costa Esmeralda" },
    { value: "pinamar", label: "Pinamar" },
    { value: "mar-del-tuyu", label: "Mar del Tuyu" },
    { value: "villa-gesell", label: "Villa Gesell" },
    { value: "mar-de-ajo", label: "Mar de Ajo" },
  ],
  "Buenos Aires Interior": [
    { value: "lujan", label: "Lujan" },
    { value: "san-vicente", label: "San Vicente" },
  ],
};

// Manejo del selector de ubicación
function initLocationSelectors() {
  const regionSelect = document.getElementById("region-select");
  const localidadSelect = document.getElementById("localidad-select");

  if (!regionSelect || !localidadSelect) return;

  regionSelect.addEventListener("change", function () {
    const regionSeleccionada = this.value;

    // Limpiar localidades
    localidadSelect.innerHTML = '<option value="">Select city...</option>';

    if (regionSeleccionada && UBICACIONES[regionSeleccionada]) {
      // Habilitar el select de localidad
      localidadSelect.disabled = false;

      // Agregar las localidades de la región seleccionada
      UBICACIONES[regionSeleccionada].forEach((item) => {
        const option = document.createElement("option");
        option.value = item.value;
        option.textContent = item.label;
        localidadSelect.appendChild(option);
      });
    } else {
      localidadSelect.disabled = true;
    }
  });

  localidadSelect.addEventListener("change", function () {
    const region = regionSelect.value;
    const localidad = this.value;

    if (region && localidad) {
      console.log(`Ubicación seleccionada: ${region} - ${localidad}`);
      // Aquí puedes agregar lógica adicional cuando se seleccione una localidad
    }
  });
}

// Manejo de herramientas (checkboxes)
function initTools() {
  function handleSingleCheckbox(containerSelector) {
    const container = document.querySelector(containerSelector);
    container.addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        container
          .querySelectorAll('input[type="checkbox"]')
          .forEach((checkbox) => {
            if (checkbox !== e.target) checkbox.checked = false;
          });
      }
    });
  }
  // Solo permitir un checkbox activo a la vez
  handleSingleCheckbox(".sidebar-left");
  handleSingleCheckbox(".floors");
  // Configurar modo de dibujo
  state.btnDraw.addEventListener("change", () => {
    if (state.btnDraw.checked) {
      state.mode = "draw";
      state.btnDraw.classList.add("active");
      state.svg.style.cursor = "crosshair";
    } else {
      state.mode = null;
      state.btnDraw.classList.remove("active");
    }
  });
  // Configurar modo de borrado
  state.btnDelete.addEventListener("change", () => {
    if (state.btnDelete.checked) {
      state.mode = "delete";
      state.btnDelete.classList.add("active");
      state.svg.style.cursor = "pointer";
    } else {
      state.mode = null;
      state.btnDelete.classList.remove("active");
    }
  });
  // Configurar modo mover
  state.btnMove.addEventListener("change", () => {
    if (state.btnMove.checked) {
      state.mode = "move";
      state.btnMove.classList.add("active");
      state.svg.style.cursor = "move";
    } else {
      state.mode = null;
      state.btnMove.classList.remove("active");
    }
  });

  // Inicializar selectores de ubicación
  initLocationSelectors();
}
