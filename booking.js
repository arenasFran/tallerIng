import Reserva from "./classes/reserva.js";

let reservas = [];
const reservasGuardadas = localStorage.getItem("reservas");
if (reservasGuardadas) {
  reservas = JSON.parse(reservasGuardadas);
}


const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("horaSelect");
const bookingForm = document.getElementById("bookingForm");
const feedback = document.getElementById("bookingFeedback");


function generarHorarios() {
  const horarios = [];
  for (let h = 9; h <= 21; h++) {
    horarios.push(`${h.toString().padStart(2, "0")}:00`);
    horarios.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return horarios;
}


function actualizarHoras(fecha) {
  horaSelect.innerHTML = "";

  if (!fecha) {
    horaSelect.disabled = true;
    horaSelect.innerHTML = `<option value="">Seleccione una fecha primero</option>`;
    return;
  }

  horaSelect.disabled = false;

  const horarios = generarHorarios();


  const horasReservadas = reservas
    .filter((r) => r.fecha === fecha)
    .map((r) => r.hora);


  const opcionVacia = document.createElement("option");
  opcionVacia.value = "";
  opcionVacia.textContent = "Seleccione una hora";
  horaSelect.appendChild(opcionVacia);

  horarios.forEach((hora) => {
    const opcion = document.createElement("option");
    opcion.value = hora;
    opcion.textContent = hora;
    if (horasReservadas.includes(hora)) {
      opcion.disabled = true;
      opcion.textContent += " (Reservado)";
    }
    horaSelect.appendChild(opcion);
  });
}


fechaInput.addEventListener("change", (e) => {
  actualizarHoras(e.target.value);
  horaSelect.value = "";
});

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fecha = fechaInput.value;
  const hora = horaSelect.value;
  const nombreBarbero = document.getElementById("barberoSelect").value;
  const ciCliente = document.getElementById("ciCliente").value.trim();
  const nombreCliente = document.getElementById("nombreCliente").value.trim();
  const servicio = document.getElementById("servicioSelect").value;

  if (!fecha || !hora || !nombreBarbero || !ciCliente || !nombreCliente || !servicio) {
    alert("Por favor, completa todos los campos.");
    return;
  }


  const yaReservado = reservas.some(
    (r) => r.fecha === fecha && r.hora === hora
  );
  if (yaReservado) {
    alert("Esa hora ya está reservada, por favor elige otra.");
    return;
  }


  const nuevaReserva = new Reserva(fecha, hora, nombreBarbero, ciCliente, nombreCliente, servicio);
  reservas.push(nuevaReserva);


  localStorage.setItem("reservas", JSON.stringify(reservas));


  feedback.textContent = "¡Reserva realizada con éxito!";
  feedback.classList.add("show-feedback");
  setTimeout(() => {
    feedback.textContent = "";
    feedback.classList.remove("show-feedback");
  }, 3000);

 
  bookingForm.reset();
  actualizarHoras(fecha);
});


actualizarHoras(null); 
