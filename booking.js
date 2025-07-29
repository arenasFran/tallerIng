// calendarBooking.js

const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("horaSelect");

// Objeto para guardar reservas temporales por fecha
const reservasPorFecha = {};

// Genera horarios de 09:00 a 21:00 cada 30 min
function generarHorarios() {
  const horarios = [];
  for (let h = 9; h <= 21; h++) {
    horarios.push(`${h.toString().padStart(2, "0")}:00`);
    horarios.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return horarios;
}

// Carga opciones de horas para la fecha seleccionada
function cargarHoras(fecha) {
  horaSelect.innerHTML = "";
  if (!fecha) {
    horaSelect.disabled = true;
    horaSelect.innerHTML = "<option>Seleccione una fecha primero</option>";
    return;
  }

  horaSelect.disabled = false;

  const horarios = generarHorarios();

  // Obtener horas ya reservadas para esta fecha
  const reservadas = reservasPorFecha[fecha] || [];

  // Opción vacía
  const opcionVacia = document.createElement("option");
  opcionVacia.value = "";
  opcionVacia.textContent = "Seleccione una hora";
  horaSelect.appendChild(opcionVacia);

  horarios.forEach(hora => {
    const opcion = document.createElement("option");
    opcion.value = hora;
    opcion.textContent = hora;
    if (reservadas.includes(hora)) {
      opcion.disabled = true;
      opcion.textContent += " (Reservado)";
    }
    horaSelect.appendChild(opcion);
  });
}

// Evento al cambiar fecha
fechaInput.addEventListener("change", () => {
  cargarHoras(fechaInput.value);
  // Reiniciar hora seleccionada
  horaSelect.value = "";
});

// Evento al seleccionar una hora
horaSelect.addEventListener("change", () => {
  const fecha = fechaInput.value;
  const hora = horaSelect.value;
  if (!fecha || !hora) return;

  // Guardar hora como reservada para la fecha
  if (!reservasPorFecha[fecha]) {
    reservasPorFecha[fecha] = [];
  }
  reservasPorFecha[fecha].push(hora);

  // Recargar horas para actualizar el select y deshabilitar la hora elegida
  cargarHoras(fecha);

  // Resetear valor para que el usuario pueda elegir otro horario si quiere
  horaSelect.value = "";
});

// Inicializar select deshabilitado
horaSelect.disabled = true;
horaSelect.innerHTML = "<option>Seleccione una fecha primero</option>";
