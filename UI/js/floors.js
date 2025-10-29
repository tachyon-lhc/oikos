// Manejo de cambio entre pisos

const floors = document.querySelectorAll('.floors input[type="checkbox"]');

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
