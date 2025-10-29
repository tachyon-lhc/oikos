// Inicialización de la aplicación

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar referencias a elementos del DOM
  state.canvases = {
    1: document.getElementById("canvas-floor-1"),
    2: document.getElementById("canvas-floor-2"),
    3: document.getElementById("canvas-floor-3"),
  };
  state.svg = state.canvases[1]; // Canvas activo por defecto
  state.currentFloor = 1;
  // Inicializar referencias a elementos del DOM
  state.svg = document.getElementById("canvas");
  state.contextMenu = document.getElementById("contextMenu");
  state.btnDraw = document.getElementById("btn-est-rect");
  state.btnDelete = document.getElementById("btn-est-clean");
  state.btnMove = document.getElementById("btn-est-move");
  state.btnExport = document.getElementById("btn-est-exp");

  // Inicializar módulos
  initTools();
  initCanvas();
  initContextMenu();
  initExport();

  console.log("Aplicación inicializada correctamente");
});
