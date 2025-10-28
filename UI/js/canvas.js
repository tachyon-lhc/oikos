// Funciones para dibujar, mover y borrar en el canvas

function detectCorner(mouseX, mouseY, rect, threshold = 30) {
  const x = parseFloat(rect.getAttribute("x"));
  const y = parseFloat(rect.getAttribute("y"));
  const width = parseFloat(rect.getAttribute("width"));
  const height = parseFloat(rect.getAttribute("height"));

  const corners = {
    topLeft: { x: x, y: y },
    topRight: { x: x + width, y: y },
    bottomLeft: { x: x, y: y + height },
    bottomRight: { x: x + width, y: y + height },
  };

  // Verificar cada esquina
  for (const [cornerName, corner] of Object.entries(corners)) {
    const distance = Math.sqrt(
      Math.pow(mouseX - corner.x, 2) + Math.pow(mouseY - corner.y, 2),
    );

    if (distance <= threshold) {
      return cornerName; // Retorna 'topLeft', 'topRight', etc.
    }
  }

  return null; // No está cerca de ninguna esquina
}

function showOnlyFloor(floorNumber) {
  document.querySelectorAll(".rectangle-group").forEach((group) => {
    const groupFloor = parseInt(group.getAttribute("data-floor"));
    if (groupFloor === floorNumber) {
      group.style.display = "block";
    } else {
      group.style.display = "none";
    }
  });
}

function initCanvas() {
  // Empezar a dibujar

  state.svg.addEventListener("mousedown", (e) => {
    if (state.contextMenu.style.display === "block") return;
    showOnlyFloor(state.currentFloor);

    if (state.mode === "draw") {
      state.isDrawing = true;
      const rect = state.svg.getBoundingClientRect();
      state.startX = e.clientX - rect.left;
      state.startY = e.clientY - rect.top;

      // Crear un grupo que contendrá el rectángulo y el texto
      state.currentGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );

      state.currentGroup.classList.add("rectangle-group");

      state.currentGroup.setAttribute("data-floor", state.currentFloor);
      console.log("Creando rectángulo en piso:", state.currentFloor);

      // Crear el rectángulo
      state.currentRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      state.currentRect.setAttribute("x", state.startX);
      state.currentRect.setAttribute("y", state.startY);
      state.currentRect.setAttribute("width", 0);
      state.currentRect.setAttribute("height", 0);
      state.currentRect.classList.add("rectangle");
      state.currentRect.setAttribute("fill", "rgba(100,100,100,0.1)");
      state.currentRect.setAttribute("stroke", "black");
      state.currentRect.setAttribute("stroke-width", "2px");

      // Crear el texto
      state.currentText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      state.currentText.classList.add("room-label");
      state.currentText.setAttribute("x", state.startX);
      state.currentText.setAttribute("y", state.startY);
      state.currentText.setAttribute("text-anchor", "middle");
      state.currentText.setAttribute("dominant-baseline", "middle");
      state.currentText.setAttribute("fill", "black");
      state.currentText.setAttribute("font-size", "18");
      state.currentText.setAttribute("pointer-events", "none");
      state.currentText.textContent = "";

      // Agregar rect y text al grupo
      state.currentGroup.appendChild(state.currentRect);
      state.currentGroup.appendChild(state.currentText);

      // Agregar el grupo al SVG
      state.svg.appendChild(state.currentGroup);
    }

    if (state.mode === "move" && e.target.classList.contains("rectangle")) {
      state.selectedRect = e.target;
      state.selectedGroup = e.target.parentElement;

      const rect = state.svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Detectar si está cerca de una esquina
      const corner = detectCorner(mouseX, mouseY, state.selectedRect);

      if (corner) {
        // Modo redimensionar
        state.isResizing = true;
        state.resizeCorner = corner;
        state.originalX = parseFloat(state.selectedRect.getAttribute("x"));
        state.originalY = parseFloat(state.selectedRect.getAttribute("y"));
        state.originalWidth = parseFloat(
          state.selectedRect.getAttribute("width"),
        );
        state.originalHeight = parseFloat(
          state.selectedRect.getAttribute("height"),
        );
        state.offsetX = mouseX;
        state.offsetY = mouseY;
      } else {
        // Modo mover (como antes)
        state.offsetX = mouseX;
        state.offsetY = mouseY;
        state.originalX = state.selectedRect.getAttribute("x");
        state.originalY = state.selectedRect.getAttribute("y");
      }
    }
  });

  // Dibujando/Moviendo (arrastrando el mouse)
  state.svg.addEventListener("mousemove", (e) => {
    // Cambiar cursor si estamos en modo move y sobre un rectángulo
    if (
      state.mode === "move" &&
      e.target.classList.contains("rectangle") &&
      !state.isResizing &&
      !state.selectedRect
    ) {
      const rect = state.svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const corner = detectCorner(mouseX, mouseY, e.target);

      if (corner) {
        // Cambiar cursor según la esquina
        switch (corner) {
          case "topLeft":
          case "bottomRight":
            state.svg.style.cursor = "nwse-resize";
            break;
          case "topRight":
          case "bottomLeft":
            state.svg.style.cursor = "nesw-resize";
            break;
        }
      } else {
        state.svg.style.cursor = "move";
      }
    }

    // Dibujar
    if (state.isDrawing && state.mode === "draw" && state.currentRect) {
      const rect = state.svg.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const width = currentX - state.startX;
      const height = currentY - state.startY;

      let rectX = state.startX;
      let rectY = state.startY;
      let rectWidth = width;
      let rectHeight = height;

      // Ajustar para dibujar en cualquier dirección
      if (width < 0) {
        rectX = currentX;
        rectWidth = Math.abs(width);
      }

      if (height < 0) {
        rectY = currentY;
        rectHeight = Math.abs(height);
      }

      state.currentRect.setAttribute("x", rectX);
      state.currentRect.setAttribute("y", rectY);
      state.currentRect.setAttribute("width", rectWidth);
      state.currentRect.setAttribute("height", rectHeight);

      // Actualizar posición del texto al centro del rectángulo
      const centerX = rectX + rectWidth / 2;
      const centerY = rectY + rectHeight / 2;
      state.currentText.setAttribute("x", centerX);
      state.currentText.setAttribute("y", centerY);
    }

    // Mover
    if (state.mode === "move" && state.selectedRect) {
      const rect = state.svg.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dx = currentX - state.offsetX;
      const dy = currentY - state.offsetY;

      const newX = parseFloat(state.originalX) + dx;
      const newY = parseFloat(state.originalY) + dy;

      state.selectedRect.setAttribute("x", newX);
      state.selectedRect.setAttribute("y", newY);

      // Actualizar posición del texto
      const text = state.selectedGroup.querySelector(".room-label");
      if (text) {
        const width = parseFloat(state.selectedRect.getAttribute("width"));
        const height = parseFloat(state.selectedRect.getAttribute("height"));
        text.setAttribute("x", newX + width / 2);
        text.setAttribute("y", newY + height / 2);
      }
    }

    // Redimensionar - AGREGAR ESTE BLOQUE COMPLETO

    if (state.mode === "move" && state.isResizing && state.selectedRect) {
      const rect = state.svg.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dx = currentX - state.offsetX;
      const dy = currentY - state.offsetY;

      let newX = state.originalX;
      let newY = state.originalY;
      let newWidth = state.originalWidth;
      let newHeight = state.originalHeight;

      // Calcular nuevas dimensiones según la esquina
      switch (state.resizeCorner) {
        case "topLeft":
          newX = state.originalX + dx;
          newY = state.originalY + dy;
          newWidth = state.originalWidth - dx;
          newHeight = state.originalHeight - dy;
          break;
        case "topRight":
          newY = state.originalY + dy;
          newWidth = state.originalWidth + dx;
          newHeight = state.originalHeight - dy;
          break;
        case "bottomLeft":
          newX = state.originalX + dx;
          newWidth = state.originalWidth - dx;
          newHeight = state.originalHeight + dy;
          break;
        case "bottomRight":
          newWidth = state.originalWidth + dx;
          newHeight = state.originalHeight + dy;
          break;
      }

      // Evitar dimensiones negativas
      if (newWidth > 10 && newHeight > 10) {
        state.selectedRect.setAttribute("x", newX);
        state.selectedRect.setAttribute("y", newY);
        state.selectedRect.setAttribute("width", newWidth);
        state.selectedRect.setAttribute("height", newHeight);

        // Actualizar posición del texto
        const text = state.selectedGroup.querySelector(".room-label");
        if (text) {
          text.setAttribute("x", newX + newWidth / 2);
          text.setAttribute("y", newY + newHeight / 2);
        }
      }
    }
  });

  // Dejar la acción
  state.svg.addEventListener("mouseup", () => {
    if (state.isDrawing) {
      state.isDrawing = false;
      state.currentRect = null;
      state.currentGroup = null;
      state.currentText = null;
    }

    if (state.selectedRect) {
      state.selectedRect = null;
      state.selectedGroup = null;
      state.isResizing = false; // AGREGAR ESTA LÍNEA
      state.resizeCorner = null; // AGREGAR ESTA LÍNEA
    }
  });

  // Borrar rectángulo al hacer click
  state.svg.addEventListener("click", (e) => {
    if (state.mode === "delete" && e.target.classList.contains("rectangle")) {
      const group = e.target.parentElement;
      group.remove();
    }

    if (!state.contextMenu.contains(e.target)) {
      state.contextMenu.style.display = "none";
    }
  });
}
