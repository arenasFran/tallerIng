import { loadSelects, Barbero, Servicio, Reserva } from './app.js';

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


describe('Renderizado de reservas', () => {
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
  }

  test('muestra mensaje si no hay reservas', () => {
    renderBookings([]);

    const bookingList = document.getElementById('bookingList');
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

    renderBookings(reservas);

    const bookingList = document.getElementById('bookingList');
    expect(bookingList.children).toHaveLength(1);
    const li = bookingList.children[0];
    expect(li.querySelector('.booking-client').textContent).toBe('Fran');
    expect(li.querySelector('.booking-date').textContent).toBe('2025-08-10 - 15:00');
    expect(li.querySelector('.booking-barber').textContent).toBe('Barbero: Joaquín Rojas');
  });
});
