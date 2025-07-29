import Reserva from "./classes/reserva.js";
import Barbero from "./classes/barbero.js";
import Servicio from "./classes/servicios.js";

// Load existing bookings from localStorage
const saved = localStorage.getItem('reservas');
const reservas = saved ? JSON.parse(saved) : [];

// Array of available barber services
const servicios = [
  new Servicio('Corte', 500),
  new Servicio('Barba', 300),
  new Servicio('Servicio Premium', 1000),
  new Servicio('Lavado', 200),
  new Servicio('Colorimetría', 800)
];

// Array of available barbers
const barberos = [
  new Barbero('Joaquín', 'Rojas', 'Especialista en fades'),
  new Barbero('Matías', 'Suárez', 'Maestro de navaja'),
  new Barbero('Ignacio', 'Pereira', 'Artista de barbas'),
  new Barbero('Sebastián', 'Delgado', 'Colorista profesional'),
  new Barbero('Lucas', 'Méndez', 'Terapeuta capilar'),
  new Barbero('Diego', 'Montes', 'Estilista vintage')
];


const goToBooking = document.getElementById('goToBooking');
if (goToBooking) {
  goToBooking.addEventListener('click', () => {
    window.location.href = 'booking.html';
  });
}


function loadSelects(barberos, servicios) {
  const servicioSelect = document.getElementById('servicioSelect');
  const barberoSelect = document.getElementById('barberoSelect');
  if (servicioSelect && servicios) {
    servicioSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecciona un servicio';
    placeholder.disabled = true;
    placeholder.selected = true;
    servicioSelect.appendChild(placeholder);
    servicios.forEach(servicio => {
      const option = document.createElement('option');
      option.value = servicio.nombreServicio;
      option.textContent = `${servicio.nombreServicio} ($${servicio.precio})`;
      servicioSelect.appendChild(option);
    });
  }
  if (barberoSelect && barberos) {
    barberoSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecciona un barbero';
    placeholder.disabled = true;
    placeholder.selected = true;
    barberoSelect.appendChild(placeholder);
    barberos.forEach(barbero => {
      const option = document.createElement('option');
      option.value = `${barbero.nombre} ${barbero.apellido}`;
      option.textContent = `${barbero.nombre} ${barbero.apellido} - ${barbero.especialidad}`;
      barberoSelect.appendChild(option);
    });
  }
}

if (document.getElementById('servicioSelect') && document.getElementById('barberoSelect')) {
  loadSelects(barberos, servicios);
}


const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const nombreBarbero = barberoSelect ? barberoSelect.value : '';
    const ciCliente = document.getElementById('ciCliente').value;
    const nombreCliente = document.getElementById('nombreCliente').value;
    const servicioElegido = servicioSelect ? servicioSelect.value : '';
    const nuevaReserva = new Reserva(fecha, hora, nombreBarbero, ciCliente, nombreCliente);
    nuevaReserva.servicio = servicioElegido;
    reservas.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    const feedback = document.getElementById('bookingFeedback');
    feedback.textContent = '¡Reserva realizada con éxito!';
    console.log(reservas)
    feedback.classList.add('show-feedback');
    setTimeout(() => {
      feedback.textContent = '';
      feedback.classList.remove('show-feedback');
    }, 3000);
    bookingForm.reset();
  });
}

const bookingList = document.getElementById('bookingList');
if (bookingList) {
  function renderBookings() {
    bookingList.innerHTML = '';
    if (reservas.length === 0) {
      bookingList.innerHTML = '<li>No hay reservas registradas.</li>';
      return;
    }
    reservas.forEach((reserva, idx) => {
      const li = document.createElement('li');
      li.textContent = `#${idx + 1} | Fecha: ${reserva.fecha}, Hora: ${reserva.hora}, Barbero: ${reserva.nombreBarbero}, Cliente: ${reserva.nombreCliente} (CI: ${reserva.ciCliente})`;
      bookingList.appendChild(li);
    });
  }
  renderBookings();
}

export { reservas };

