// Manejo de cambio entre pisos

function showOnlyFloor(floorNumber) {
  console.trace(`showOnlyFloor llamado con floorNumber=${floorNumber}`);
  document.querySelectorAll(".rectangle-group").forEach((group) => {
    const groupFloor = parseInt(group.getAttribute("data-floor"));
    console.log(
      `Grupo con floor=${groupFloor}, mostrar=${groupFloor === floorNumber}`,
    );
    if (groupFloor === floorNumber) {
      group.style.display = "block";
    } else {
      group.style.display = "none";
    }
  });
}

function initFloors() {
  // Obtener todos los checkboxes de pisos
  const floorCheckboxes = document.querySelectorAll(
    '#floors input[type="checkbox"]',
  );

  floorCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        // Desmarcar los demás
        floorCheckboxes.forEach((other) => {
          if (other !== checkbox) other.checked = false;
        });

        // Obtener el número de piso desde el ID
        const floorId = checkbox.id; // 'floor0', 'floor1', etc.
        const floorNumber = parseInt(floorId.replace("floor", "")); // Extrae el número

        // Cambiar el piso actual
        state.currentFloor = floorNumber;

        // Mostrar solo ese piso
        showOnlyFloor(floorNumber);

        console.log(`Cambiado a piso ${floorNumber}`);
      }
    });
  });

  // AGREGAR ESTO: Marcar piso 1 por defecto e inicializar el estado
  const defaultFloor = document.getElementById("floor1");
  if (defaultFloor) {
    defaultFloor.checked = true;
    state.currentFloor = 1;
    showOnlyFloor(1);
  }
}
