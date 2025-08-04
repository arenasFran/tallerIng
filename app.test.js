import { renderBookings, loadSelects, Barbero, Servicio, Reserva, reserva } from './app.js';

test('loadSelects carga correctamente barberos y servicios', () => {
  document.body.innerHTML = `
    <select id="servicioSelect"></select>
    <select id="barberoSelect"></select>
  `;

  loadSelects();

  const servicioSelect = document.getElementById('servicioSelect');
  const barberoSelect = document.getElementById('barberoSelect');

  expect(servicioSelect.children.length).toBe(6);
  expect(servicioSelect.children[1].textContent).toBe('Corte ($500)');

  expect(barberoSelect.children.length).toBe(7);
  expect(barberoSelect.children[1].textContent).toBe('Joaquín Rojas - Especialista en fades');
});


/* describe('Renderizado de reservas', () => {
  beforeEach(() => {
    document.body.innerHTML = `<ul id="bookingList"></ul>`;
  });

  function renderBookings(reservas) {
    const bookingList = document.getElementById('bookingList');
    bookingList.innerHTML = '';
    if (reservas.length === 0) {
      bookingList.innerHTML = '<li>No hay reservas registradas.</li>';
      return;
    }
    reservas.forEach((reserva, idx) => {
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

      const serviceInfo = document.createElement('div');
      serviceInfo.className = 'booking-service';
      serviceInfo.textContent = `CI: ${reserva.ciCliente}`;

      const barberInfo = document.createElement('div');
      barberInfo.className = 'booking-barber';
      barberInfo.textContent = `Barbero: ${reserva.nombreBarbero}`;

      const bookingId = document.createElement('div');
      bookingId.className = 'booking-id';
      bookingId.textContent = `Reserva #${idx + 1}`;

      detailsDiv.appendChild(serviceInfo);
      detailsDiv.appendChild(barberInfo);
      detailsDiv.appendChild(bookingId);

      li.appendChild(headerDiv);
      li.appendChild(detailsDiv);

      bookingList.appendChild(li);
    });
  } */

test('muestra mensaje si no hay reservas', () => {
  document.body.innerHTML = `
    <ul id="bookingList"></ul>
  `;
  const reservas = [];
  renderBookings(reservas);

  expect(bookingList.children).toHaveLength(1);
  expect(bookingList.children[0].textContent).toBe('No hay reservas registradas.');
});

test('renderiza reservas correctamente', () => {
  const reservas = [
    {
      nombreCliente: 'Fran',
      fecha: '2025-08-10',
      hora: '15:00',
      nombreBarbero: 'Joaquín Rojas',
      ciCliente: '1234',
      servicio: 'Corte',
    },
  ];

  document.body.innerHTML = `
    <ul id="bookingList"></ul>
  `;

  renderBookings(reservas);

  const bookingList = document.getElementById('bookingList');
  expect(bookingList.children).toHaveLength(1);
  const li = bookingList.children[0];
  expect(li.querySelector('.booking-client').textContent).toBe('Fran');
  expect(li.querySelector('.booking-date').textContent).toBe('2025-08-10 - 15:00');
  expect(li.querySelector('.booking-barber').textContent).toBe('Barbero: Joaquín Rojas');
});



test('creates and stores a new reservation correctly', () => {
  document.body.innerHTML = `
      <input id="fecha" value="2025-08-10">
      <select id="horaSelect">
        <option value="15:00" selected>15:00</option>
      </select>
      <select id="barberoSelect">
        <option value="Joaquín Rojas" selected>Joaquín Rojas</option>
      </select>
      <input id="ciCliente" value="12345678">
      <input id="nombreCliente" value="Fran">
      <select id="servicioSelect">
        <option value="Corte" selected>Corte</option>
      </select>
      <div id="bookingFeedback"></div>
      <form id="bookingForm"></form>
    `;

  const reservas = [];

  reserva(reservas);


  expect(reservas).toHaveLength(1);
  expect(reservas[0]).toBeInstanceOf(Reserva);
  expect(reservas[0].nombreCliente).toBe('Fran');
  expect(reservas[0].ciCliente).toBe('12345678');
  expect(reservas[0].fecha).toBe('2025-08-10');
  expect(reservas[0].hora).toBe('15:00');
  expect(reservas[0].nombreBarbero).toBe('Joaquín Rojas');
  expect(reservas[0].servicio).toBe('Corte');


  const storedReservas = JSON.parse(localStorage.getItem('reservas'));
  expect(storedReservas).toHaveLength(1);
  expect(storedReservas[0].nombreCliente).toBe('Fran');


  const feedback = document.getElementById('bookingFeedback');
  expect(feedback.textContent).toBe('¡Reserva realizada con éxito!');
  expect(feedback.classList.contains('show-feedback')).toBe(true);
});

describe('Función reserva()', () => {
  let reservas = [];

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="bookingForm">
        <input id="fecha" value="2025-08-10">
        <select id="horaSelect">
          <option value="15:00" selected>15:00</option>
        </select>
        <select id="barberoSelect">
          <option value="Joaquín Rojas" selected>Joaquín Rojas</option>
        </select>
        <input id="ciCliente" value="12345678">
        <input id="nombreCliente" value="Fran">
        <select id="servicioSelect">
          <option value="Corte" selected>Corte</option>
        </select>
        <div id="bookingFeedback"></div>
      </form>
    `;
    
    reservas.length = 0;
    localStorage.clear();
  });

  test('no crea reserva si falta la fecha', () => {
    document.getElementById('fecha').value = '';
    
    const result = reserva(reservas);
    
    expect(result).toBe(false);
    expect(reservas).toHaveLength(0);
    expect(localStorage.getItem('reservas')).toBeNull();
  });

  test('no sobrescribe reservas existentes', () => {
    reserva(reservas);
    
    document.getElementById('nombreCliente').value = 'Juan';
    reserva(reservas);
    
    const storedReservas = JSON.parse(localStorage.getItem('reservas'));
    expect(storedReservas).toHaveLength(2);
    expect(storedReservas[0].nombreCliente).toBe('Fran');
    expect(storedReservas[1].nombreCliente).toBe('Juan');
  });

});