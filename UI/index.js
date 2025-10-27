const tools = document.querySelectorAll('.sidebar input[type="checkbox"]');

tools.forEach((tool) => {
  tool.addEventListener("change", () => {
    if (tool.checked) {
      tools.forEach((other) => {
        if (other !== tool) other.checked = false;
      });
    }
  });
});

// DIBUJAR EN EL CANVAS

const svg = document.getElementById("canvas");
const btnDraw = document.getElementById("btn-est-rect");
const btnDelete = document.getElementById("btn-est-clean");
const btnMove = document.getElementById("btn-est-move");

let mode = null; // 'draw' o 'delete' o 'move'
let isDrawing = false;
let startX, startY;
let currentRect = null;
let selectedReact = null;
let offsetX, offsetY; // La posición inicial del mouse
let originalX, originalY; // La posición original del rectángulo

// configurar modo de dibujo
btnDraw.addEventListener("change", () => {
  console.log("Checkbox cambió. Está checked:", btnDraw.checked);
  console.log("Mode antes:", mode);
  if (btnDraw.checked) {
    mode = "draw";
    btnDraw.classList.add("active");
    svg.style.cursor = "crosshair";
  } else {
    mode = null;
    btnDraw.classList.remove("active");
  }
});

// Configurar modo de borrado
btnDelete.addEventListener("change", () => {
  if (btnDelete.checked) {
    mode = "delete";
    btnDelete.classList.add("active");
    svg.style.cursor = "pointer";
  } else {
    mode = null;
    btnDelete.classList.remove("active");
  }
});

// Configurar modo mover
btnMove.addEventListener("change", () => {
  if (btnMove.checked) {
    mode = "move";
    btnMove.classList.add("active");
  } else {
    mode = null;
    btnMove.classList.remove("active");
  }
});

// Empezar a dibujar
svg.addEventListener("mousedown", (e) => {
  if (mode === "draw") {
    isDrawing = true;
    const rect = svg.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    // Crear un nuevo rectángulo
    currentRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    currentRect.setAttribute("x", startX);
    currentRect.setAttribute("y", startY);
    currentRect.setAttribute("width", 0);
    currentRect.setAttribute("height", 0);
    currentRect.classList.add("rectangle");
    currentRect.setAttribute("fill", "rgba(100,100,100,0.1)");
    currentRect.setAttribute("stroke", "black");
    currentRect.setAttribute("stroke-width", "2px");
    svg.appendChild(currentRect);
  }
});

// Dibujando (arrastrando el mouse)
svg.addEventListener("mousemove", (e) => {
  if (isDrawing && mode === "draw" && currentRect) {
    const rect = svg.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = currentX - startX;
    const height = currentY - startY;

    // Ajustar para dibujar en cualquier dirección
    if (width < 0) {
      currentRect.setAttribute("x", currentX);
      currentRect.setAttribute("width", Math.abs(width));
    } else {
      currentRect.setAttribute("width", width);
    }

    if (height < 0) {
      currentRect.setAttribute("y", currentY);
      currentRect.setAttribute("height", Math.abs(height));
    } else {
      currentRect.setAttribute("height", height);
    }
  }
});

// Terminar de dibujar
svg.addEventListener("mouseup", () => {
  if (isDrawing) {
    isDrawing = false;
    currentRect = null;
  }
});

// Borrar rectángulo al hacer click
svg.addEventListener("click", (e) => {
  if (mode === "delete" && e.target.classList.contains("rectangle")) {
    e.target.remove();
  }
});
