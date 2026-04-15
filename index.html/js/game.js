// ===== Datos iniciales =====
let inventario = [];
let lotes = [];

// ===== Navegación =====
function mostrarSeccion(id) {
  document.querySelectorAll("main, section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ===== Inventario =====
function cargarInventario() {
  const tabla = document.getElementById("tablaInventario");
  tabla.innerHTML = "";
  inventario.forEach(animal => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${animal.id}</td>
      <td>${animal.nombre}</td>
      <td>${animal.edad} años</td>
      <td>${animal.estado}</td>
      <td>${animal.peso} kg</td>
      <td><img src="${animal.foto}" alt="${animal.nombre}" width="60"></td>
    `;
    tabla.appendChild(fila);
  });
  actualizarResumen();
}

function buscarAnimal() {
  const id = document.getElementById("buscarArete").value.trim();
  const resultado = document.getElementById("resultado");
  const animal = inventario.find(a => a.id === id);
  if (animal) {
    resultado.innerHTML = `
      <h3>${animal.nombre}</h3>
      <p>Edad: ${animal.edad} años</p>
      <p>Estado: ${animal.estado}</p>
      <p>Peso: ${animal.peso} kg</p>
      <img src="${animal.foto}" alt="${animal.nombre}" width="200">
    `;
  } else {
    resultado.innerHTML = "<p style='color:red'>Animal no encontrado</p>";
  }
}

// ===== Registro de animales =====
document.getElementById("registro-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const id = document.getElementById("arete").value;
  const edad = parseInt(document.getElementById("edad").value);
  const peso = parseFloat(document.getElementById("peso").value);
  const estado = document.getElementById("estado").value;
  const fotoInput = document.getElementById("foto");

  let fotoURL = "img/default.jpg";
  if (fotoInput.files.length > 0) {
    fotoURL = URL.createObjectURL(fotoInput.files[0]);
  }

  inventario.push({ id, nombre, edad, estado, peso, foto: fotoURL });
  cargarInventario();
  registrarActividad(`Nuevo animal registrado: ${nombre} (${id})`);

  this.reset();
  alert("Animal registrado con éxito");
});

// ===== Lotes =====
document.getElementById("lotes-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const area = document.getElementById("area").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const estadoGrupo = document.getElementById("estadoGrupo").value;

  lotes.push({ area, cantidad, estadoGrupo });
  cargarLotes();
  registrarActividad(`Nuevo lote registrado en área ${area} con ${cantidad} animales (${estadoGrupo})`);

  this.reset();
});

function cargarLotes() {
  const tabla = document.getElementById("tablaLotes");
  tabla.innerHTML = "";
  let total = 0;
  lotes.forEach(lote => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${lote.area}</td>
      <td>${lote.cantidad}</td>
      <td>${lote.estadoGrupo}</td>
    `;
    tabla.appendChild(fila);
    total += lote.cantidad;
  });
  document.getElementById("totalLotes").textContent = total;
}

// ===== Actividades recientes =====
function registrarActividad(texto) {
  const lista = document.getElementById("listaActividades");
  const item = document.createElement("li");
  const fecha = new Date().toLocaleString();
  item.textContent = `📌 ${texto} — ${fecha}`;
  lista.prepend(item);
}

// ===== Resumen en Inicio =====
function actualizarResumen() {
  document.getElementById("totalGanado").textContent = inventario.length;
  document.getElementById("vacasProduccion").textContent = inventario.filter(a => a.estado === "produccion").length;
  document.getElementById("animalesEnfermos").textContent = inventario.filter(a => a.estado === "enfermo").length;
  document.getElementById("proximosPartos").textContent = inventario.filter(a => a.estado === "gestacion").length;

  actualizarGraficas();
}

// ===== Gráficas con Chart.js =====
let graficaLeche, graficaCrecimiento, graficaSanitario;

function inicializarGraficas() {
  graficaLeche = new Chart(document.getElementById("graficaLeche"), {
    type: 'bar',
    data: {
      labels: ["Enero", "Febrero", "Marzo", "Abril"],
      datasets: [{
        label: "Litros de leche",
        data: [0, 0, 0, 0],
        backgroundColor: "#2e7d32"
      }]
    }
  });

  graficaCrecimiento = new Chart(document.getElementById("graficaCrecimiento"), {
    type: 'line',
    data: {
      labels: ["2023", "2024", "2025", "2026"],
      datasets: [{
        label: "Número de cabezas",
        data: [0, 0, 0, 0],
        borderColor: "#1565c0",
        fill: false
      }]
    }
  });

  graficaSanitario = new Chart(document.getElementById("graficaSanitario"), {
    type: 'pie',
    data: {
      labels: ["Producción", "Gestación", "Enfermos"],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ["#43a047", "#fbc02d", "#e53935"]
      }]
    }
  });
}

function actualizarGraficas() {
  // Actualizar gráfico sanitario
  const produccion = inventario.filter(a => a.estado === "produccion").length;
  const gestacion = inventario.filter(a => a.estado === "gestacion").length;
  const enfermos = inventario.filter(a => a.estado === "enfermo").length;

  graficaSanitario.data.datasets[0].data = [produccion, gestacion, enfermos];
  graficaSanitario.update();

  // Actualizar crecimiento (ejemplo: total ganado por año)
  graficaCrecimiento.data.datasets[0].data = [inventario.length, inventario.length, inventario.length, inventario.length];
  graficaCrecimiento.update();
}

// ===== Inicialización =====
document.addEventListener("DOMContentLoaded", () => {
  cargarInventario();
  cargarLotes();
  inicializarGraficas();
  mostrarSeccion("inicio");
});
