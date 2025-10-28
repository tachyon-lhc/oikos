// Manejo de cambio entre pisos

function initFloorSelector() {
  const floorButtons = document.querySelectorAll(".floor-btn");

  floorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const floor = parseInt(btn.getAttribute("data-floor"));

      // Cambiar piso activo
      switchToFloor(floor);

      // Actualizar botón activo
      floorButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function switchToFloor(floor) {
  // Ocultar todos los canvas
  Object.values(state.canvases).forEach((canvas) => {
    canvas.style.display = "none";
  });

  // Mostrar el canvas seleccionado
  state.canvases[floor].style.display = "block";

  // Actualizar canvas activo en el state
  state.svg = state.canvases[floor];
  state.currentFloor = floor;

  console.log(`Cambiado a piso ${floor}`);
}
