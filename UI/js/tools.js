// Manejo de herramientas (checkboxes)
function initTools() {
  const tools = document.querySelectorAll(
    '.sidebar-left input[type="checkbox"]',
  );

  // Solo permitir un checkbox activo a la vez
  tools.forEach((tool) => {
    tool.addEventListener("change", () => {
      if (tool.checked) {
        tools.forEach((other) => {
          if (other !== tool) other.checked = false;
        });
      }
    });
  });

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
}
