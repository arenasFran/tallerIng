import Reserva from "./classes/reserva.js";
import Barbero from "./classes/barbero.js";
import Servicio from "./classes/servicios.js";

// Load existing bookings from localStorage
const saved = localStorage.getItem('reservas');
const reservas = saved ? JSON.parse(saved) : [];

const goToBooking = document.getElementById('goToBooking');
if (goToBooking) {
  goToBooking.addEventListener('click', () => {
    window.location.href = 'booking.html';
  });
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const nombreBarbero = document.getElementById('nombreBarbero').value;
    const ciCliente = document.getElementById('ciCliente').value;
    const nombreCliente = document.getElementById('nombreCliente').value;
    const nuevaReserva = new Reserva(fecha, hora, nombreBarbero, ciCliente, nombreCliente);
    reservas.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservas)); // Save after adding
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

// Render bookings in admin panel if present
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

