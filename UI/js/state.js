// Estado global de la aplicación
const state = {
  // Elementos del DOM
  svg: null,
  contextMenu: null,
  btnDraw: null,
  btnDelete: null,
  btnMove: null,
  btnExport: null,

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
  originalWidth: 0, // AGREGAR
  originalHeight: 0, // AGREGAR

  // Para menú contextual
  currentContextRect: null,

  // Para redimensionar
  isResizing: false,
  resizeCorner: null,
};
