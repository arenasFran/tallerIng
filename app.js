import Reserva from "./classes/reserva.js";
import Barbero from "./classes/barbero.js";
import Servicio from "./classes/servicios.js";


const saved = localStorage.getItem('reservas');
const reservas = saved ? JSON.parse(saved) : [];


const servicios = [
  new Servicio('Corte', 500),
  new Servicio('Barba', 300),
  new Servicio('Servicio Premium', 1000),
  new Servicio('Lavado', 200),
  new Servicio('Colorimetría', 800)
];

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

function loadSelects() {
  const servicioSelect = document.getElementById('servicioSelect');
  const barberoSelect = document.getElementById('barberoSelect');

  if (servicioSelect) {
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

  if (barberoSelect) {
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
  loadSelects();
}




const bookingList = document.getElementById('bookingList');
if (bookingList) {
  renderBookings(reservas);
}


function renderBookings(reservas) {
  const bookingList = document.getElementById('bookingList');
  if (!bookingList) return;

  bookingList.innerHTML = '';

  if (reservas.length === 0) {
    bookingList.innerHTML = '<li>No hay reservas registradas.</li>';
    return;
  }

   reservas
    .slice() 
    .sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`);
      const dateB = new Date(`${b.fecha}T${b.hora}`);
      return dateA - dateB;
    })
    .forEach((reserva, idx) => {
      const li = document.createElement('li');
      li.className = 'booking-item';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'booking-header';

    const clientName = document.createElement('h3');
    clientName.className = 'booking-client';
    clientName.textContent = reserva.nombreCliente;

    const bookingDate = document.createElement('span');
    bookingDate.className = 'booking-date';
    bookingDate.textContent = `${reserva.fecha} - ${reserva.hora}`;

    headerDiv.appendChild(clientName);
    headerDiv.appendChild(bookingDate);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'booking-details';

    const phoneInfo = document.createElement('div');
    phoneInfo.className = 'booking-phone';
    phoneInfo.textContent = `Celular: ${reserva.celularCliente}`;

    const emailInfo = document.createElement('div');
    emailInfo.className = 'booking-email';
    emailInfo.textContent = `Email: ${reserva.mailCliente}`;

    const barberInfo = document.createElement('div');
    barberInfo.className = 'booking-barber';
    barberInfo.textContent = `Barbero: ${reserva.nombreBarbero}`;

    const bookingId = document.createElement('div');
    bookingId.className = 'booking-id';
    bookingId.textContent = `Reserva #${idx + 1}`;

    detailsDiv.appendChild(phoneInfo);
    detailsDiv.appendChild(emailInfo);
    detailsDiv.appendChild(barberInfo);
    detailsDiv.appendChild(bookingId);

    li.appendChild(headerDiv);
    li.appendChild(detailsDiv);
    bookingList.appendChild(li);
  });
}


export { Reserva, Servicio, Barbero, loadSelects, renderBookings };
