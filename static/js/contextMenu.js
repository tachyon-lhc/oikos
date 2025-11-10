// Manejo del menú contextual para asignar tipos de habitaciones

function initContextMenu() {
  // Click derecho en el canvas
  state.svg.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    // Solo mostrar menú si hiciste click en un rectángulo
    if (!event.target.classList.contains("rectangle")) {
      return;
    }

    // Guardar referencia al rectángulo
    state.currentContextRect = event.target;

    // Resetear estado de movimiento
    state.selectedRect = null;
    state.selectedGroup = null;
    state.isDrawing = false;

    // Desactivar todos los modos
    state.mode = null;
    state.btnDraw.checked = false;
    state.btnDraw.classList.remove("active");
    state.btnDelete.checked = false;
    state.btnDelete.classList.remove("active");
    state.btnMove.checked = false;
    state.btnMove.classList.remove("active");

    // Mostrar menú
    state.contextMenu.style.display = "block";
    state.contextMenu.style.left = `${event.pageX}px`;
    state.contextMenu.style.top = `${event.pageY}px`;
  });

  // Seleccionar tipo de habitación
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const tipo = e.target.getAttribute("data-tipo");

      if (state.currentContextRect) {
        // Guardar el tipo en el rectángulo como atributo
        state.currentContextRect.setAttribute("data-tipo", tipo);

        // Actualizar el texto
        const group = state.currentContextRect.parentElement;
        const text = group.querySelector(".room-label");
        if (text) {
          text.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        }
      }

      // Ocultar el menú
      state.contextMenu.style.display = "none";
      state.currentContextRect = null;
    });
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!state.contextMenu.contains(e.target)) {
      state.contextMenu.style.display = "none";
    }
  });
}
