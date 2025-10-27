// Estado global de la aplicación
const state = {
  // Elementos del DOM
  svg: null,
  contextMenu: null,
  btnDraw: null,
  btnDelete: null,
  btnMove: null,

  // Estado de la aplicación
  mode: null, // 'draw', 'delete', 'move'
  isDrawing: false,

  // Para dibujar
  startX: 0,
  startY: 0,
  currentRect: null,
  currentGroup: null,

  // Para mover
  selectedRect: null,
  offsetX: 0,
  offsetY: 0,
  originalX: 0,
  originalY: 0,

  // Para menú contextual
  currentContextRect: null,
};
