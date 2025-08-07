import Reserva from "./classes/reserva.js";

document
  .getElementById("barberoSelect")
  .addEventListener("change", () => {
    actualizarHoras(fechaInput.value);
  });

let reservas = [];
const reservasGuardadas = localStorage.getItem("reservas");
if (reservasGuardadas) {
  reservas = JSON.parse(reservasGuardadas);
}


const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("horaSelect");
const bookingForm = document.getElementById("bookingForm");
const feedback = document.getElementById("bookingFeedback");


function setMinDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  fechaInput.min = todayString;
}

setMinDate();


function generarHorarios() {
  const horarios = [];
  for (let h = 9; h <= 20; h++) {
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

  const nombreBarbero = document.getElementById("barberoSelect").value;

  const horarios = generarHorarios();

  const horasReservadas = reservas
    .filter((r) => r.fecha === fecha && r.nombreBarbero === nombreBarbero)
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
      opcion.style.color = "#999";
    }


    const today = new Date();
    const selectedDate = new Date(fecha);
    if (selectedDate.toDateString() === today.toDateString()) {
      const [horaHora, horaMinuto] = hora.split(':').map(Number);
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (horaHora < currentHour || (horaHora === currentHour && horaMinuto <= currentMinute)) {
        opcion.disabled = true;
        opcion.textContent += " (Hora pasada)";
        opcion.style.color = "#999";
      }
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
  const celCliente = document.getElementById("celCliente").value.trim();
  const mailCliente = document.getElementById("mailCliente").value.trim();
  const nombreCliente = document.getElementById("nombreCliente").value.trim();
  const servicio = document.getElementById("servicioSelect").value;

  if (!fecha || !hora || !nombreBarbero || !celCliente || !mailCliente || !nombreCliente || !servicio) {
    feedback.textContent = 'Por favor complete todos los campos obligatorios';
    feedback.classList.add('show-feedback', 'error-feedback');
    setTimeout(() => {
      feedback.textContent = '';
      feedback.classList.remove('show-feedback', 'error-feedback');
    }, 3000);
    return;
  }


  const selectedDate = new Date(fecha);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    feedback.textContent = 'No se pueden hacer reservas para fechas pasadas';
    feedback.classList.add('show-feedback', 'error-feedback');
    setTimeout(() => {
      feedback.textContent = '';
      feedback.classList.remove('show-feedback', 'error-feedback');
    }, 3000);
    return;
  }


  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [selectedHour, selectedMinute] = hora.split(':').map(Number);

    if (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute <= currentMinute)) {
      feedback.textContent = 'No se pueden hacer reservas para horas pasadas';
      feedback.classList.add('show-feedback', 'error-feedback');
      setTimeout(() => {
        feedback.textContent = '';
        feedback.classList.remove('show-feedback', 'error-feedback');
      }, 3000);
      return;
    }
  }


  const yaReservado = reservas.some(
    (r) => r.fecha === fecha && r.hora === hora && r.nombreBarbero === nombreBarbero
  );
  if (yaReservado) {
    feedback.textContent = 'Esa hora ya está reservada, por favor elige otra.';
    feedback.classList.add('show-feedback', 'error-feedback');
    setTimeout(() => {
      feedback.textContent = '';
      feedback.classList.remove('show-feedback', 'error-feedback');
    }, 3000);
    return;
  }

  const nuevaReserva = new Reserva(
    fecha,
    hora,
    servicio,
    nombreBarbero,
    celCliente,  
    mailCliente,
    nombreCliente
  );
  console.log("Nueva reserva:", nuevaReserva);
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


  fechaInput.value = "";
  horaSelect.disabled = true;
  horaSelect.innerHTML = `<option value="">Seleccione una fecha primero</option>`;


  const bookingList = document.getElementById('bookingList');
  if (bookingList) {

    import('./app.js').then(module => {
      module.renderBookings(reservas);
    }).catch(err => {
      console.log('No se pudo actualizar la lista de reservas:', err);
    });
  }
});


actualizarHoras(null); 
