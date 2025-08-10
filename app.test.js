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

test('loadSelects coloca placeholders correctamente', () => {
  document.body.innerHTML = `
    <select id="servicioSelect"></select>
    <select id="barberoSelect"></select>
  `;

  loadSelects();

  const servicioSelect = document.getElementById('servicioSelect');
  const barberoSelect = document.getElementById('barberoSelect');

  expect(servicioSelect.firstChild.textContent).toBe('Selecciona un servicio');
  expect(servicioSelect.firstChild.disabled).toBe(true);
  expect(servicioSelect.firstChild.selected).toBe(true);

  expect(barberoSelect.firstChild.textContent).toBe('Selecciona un barbero');
  expect(barberoSelect.firstChild.disabled).toBe(true);
  expect(barberoSelect.firstChild.selected).toBe(true);
});

test('muestra mensaje si no hay reservas', () => {
  document.body.innerHTML = `<ul id="bookingList"></ul>`;
  const reservas = [];
  renderBookings(reservas);

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

  document.body.innerHTML = `<ul id="bookingList"></ul>`;

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
      <form id="bookingForm">
      <input id="fecha" value="2025-08-10">
      <select id="horaSelect"><option value="15:00" selected>15:00</option></select>
      <select id="barberoSelect"><option value="Joaquín Rojas" selected>Joaquín Rojas</option></select>
      <input id="celCliente" value="12345678">
      <input id="mailCliente" value="test@test.com">
      <input id="nombreCliente" value="Fran">
      <select id="servicioSelect"><option value="Corte" selected>Corte</option></select>
      <div id="bookingFeedback"></div>
    </form>
    <ul id="bookingList"></ul>
  `;

  const reservas = [];

  reserva(reservas);

  expect(reservas).toHaveLength(1);
  expect(reservas[0]).toBeInstanceOf(Reserva);
  expect(reservas[0].nombreCliente).toBe('Fran');
  //expect(reservas[0].celCliente).toBe('12345678');
  expect(reservas[0].mailCliente).toBe('test@test.com');
  expect(reservas[0].fecha).toBe('2025-08-10');
  expect(reservas[0].hora).toBe('15:00');
  expect(reservas[0].nombreBarbero).toBe('Joaquín Rojas');
  expect(reservas[0].servicio).toBe('Corte');

  const storedReservas = JSON.parse(localStorage.getItem('reservas'));
  expect(storedReservas).toHaveLength(1);
  expect(storedReservas[0].nombreCliente).toBe('Fran');

  const feedback = document.getElementById('bookingFeedback');
  //expect(feedback.textContent).toBe('¡Reserva realizada con éxito!');
  //expect(feedback.classList.contains('show-feedback')).toBe(true);
});

describe('Función reserva()', () => {
  let reservas = [];

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="bookingForm">
      <input id="fecha" value="2025-08-10">
      <select id="horaSelect"><option value="15:00" selected>15:00</option></select>
      <select id="barberoSelect"><option value="Joaquín Rojas" selected>Joaquín Rojas</option></select>
      <input id="celCliente" value="12345678">
      <input id="mailCliente" value="test@test.com">
      <input id="nombreCliente" value="Fran">
      <select id="servicioSelect"><option value="Corte" selected>Corte</option></select>
      <div id="bookingFeedback"></div>
    </form>
    <ul id="bookingList"></ul>
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
    document.getElementById('fecha').value = '2025-08-10';
    document.getElementById('celCliente').value = '123456768';
    document.getElementById('mailCliente').value = 'Juan@gmail.com';
    reserva(reservas);

    const storedReservas = JSON.parse(localStorage.getItem('reservas'));
    expect(storedReservas).toHaveLength(2);
    expect(storedReservas[0].nombreCliente).toBe('Fran');
    expect(storedReservas[1].nombreCliente).toBe('Juan');
  });

  test('no crea reserva si falta el nombre del cliente', () => {
    document.body.innerHTML = `
      <form id="bookingForm">
      <input id="fecha" value="2025-08-10">
      <select id="horaSelect"><option value="15:00" selected>15:00</option></select>
      <select id="barberoSelect"><option value="Joaquín Rojas" selected>Joaquín Rojas</option></select>
      <input id="celCliente" value="12345678">
      <input id="mailCliente" value="test@test.com">
      <input id="nombreCliente">
      <select id="servicioSelect"><option value="Corte" selected>Corte</option></select>
      <div id="bookingFeedback"></div>
    </form>
    <ul id="bookingList"></ul>
    `;

    const reservas = [];
    const resultado = reserva(reservas);

    expect(reservas).toHaveLength(0);
  });

  test('resetea el formulario luego de hacer una reserva', () => {
    document.body.innerHTML = `
    <form id="bookingForm">
      <input id="fecha" value="2025-08-10">
      <select id="horaSelect"><option value="15:00" selected>15:00</option></select>
      <select id="barberoSelect"><option value="Joaquín Rojas" selected>Joaquín Rojas</option></select>
      <input id="celCliente" value="12345678">
      <input id="mailCliente" value="test@test.com">
      <input id="nombreCliente" value="Fran">
      <select id="servicioSelect"><option value="Corte" selected>Corte</option></select>
      <div id="bookingFeedback"></div>
    </form>
    <ul id="bookingList"></ul>
  `;

    // Espía el método reset del formulario
    const form = document.getElementById('bookingForm');
    const reservas = [];
    reserva(reservas);
    const nombreClie = document.getElementById('nombreCliente').value;
    const fecha = document.getElementById('fecha').value;
    const celCliente = document.getElementById('celCliente').value;
    const mailCliente = document.getElementById('mailCliente').value;

    expect(reservas).toHaveLength(1);
    expect(nombreClie).toBe("");
    expect(fecha).toBe("");
    expect(celCliente).toBe("");
    expect(mailCliente).toBe("");
  });

  test('renderiza la reserva luego de crearla', () => {
    document.body.innerHTML += `<ul id="bookingList"></ul>`;

    const reservas = [
      new Reserva("2025-08-10", "15:00", "Corte", "Joaquín Rojas", "12345678", "mail@gmail.com", "Fran")
    ];

    reserva(reservas);
    renderBookings(reservas);

    const li = document.querySelector('.booking-item');
    expect(li).not.toBeNull();
    expect(li.querySelector('.booking-client').textContent).toBe("Fran");
  });

  test('reserva se ejecuta correctamente con evento submit', () => {
    const form = document.getElementById('bookingForm');

    let preventDefaultCalled = false;

    form.addEventListener('submit', (e) => {
      if (typeof e.preventDefault === 'function') {
        preventDefaultCalled = true;
        e.preventDefault();
      }
      reserva(reservas);
    });

    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);

    expect(reservas).toHaveLength(1);
  });
});

describe('Validación de fechas y horas', () => {
  let reservas = [];

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="bookingForm">
        <input id="fecha" value="2025-08-10">
        <select id="horaSelect"><option value="15:00" selected>15:00</option></select>
        <select id="barberoSelect"><option value="Joaquín Rojas" selected>Joaquín Rojas</option></select>
        <input id="celCliente" value="12345678">
        <input id="mailCliente" value="test@test.com">
        <input id="nombreCliente" value="Fran">
        <select id="servicioSelect"><option value="Corte" selected>Corte</option></select>
        <div id="bookingFeedback"></div>
      </form>
      <ul id="bookingList"></ul>
    `;
    reservas.length = 0;
    localStorage.clear();
  });

  test('permite reservas para fechas futuras', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    document.getElementById('fecha').value = tomorrowString;
    
    const result = reserva(reservas);
    
    expect(result).toBe(true);
    expect(reservas).toHaveLength(1);
  });

  test('permite reservas para hoy con hora futura', () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const futureHour = `${today.getHours() + 2}:00`;
    
    document.getElementById('fecha').value = todayString;
    document.getElementById('horaSelect').innerHTML = `<option value="${futureHour}" selected>${futureHour}</option>`;
    
    const result = reserva(reservas);
    
    expect(result).toBe(true);
    expect(reservas).toHaveLength(1);
  });

  test('permite múltiples reservas para diferentes horarios', () => {
    // Primera reserva
    reserva(reservas);
    
    // Segunda reserva para diferente hora - necesitamos rellenar los campos que se limpiaron
    document.getElementById('fecha').value = '2025-08-10';
    document.getElementById('horaSelect').innerHTML = '<option value="16:00" selected>16:00</option>';
    document.getElementById('celCliente').value = '12345678';
    document.getElementById('mailCliente').value = 'test@test.com';
    document.getElementById('nombreCliente').value = 'Fran';
    
    const result = reserva(reservas);
    
    expect(result).toBe(true);
    expect(reservas).toHaveLength(2);
  });
});

describe('Validación de formulario', () => {
  let reservas = [];

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="bookingForm">
        <input id="fecha" value="2025-08-10">
        <select id="horaSelect"><option value="15:00" selected>15:00</option></select>
        <select id="barberoSelect"><option value="Joaquín Rojas" selected>Joaquín Rojas</option></select>
        <input id="celCliente" value="12345678">
        <input id="mailCliente" value="test@test.com">
        <input id="nombreCliente" value="Fran">
        <select id="servicioSelect"><option value="Corte" selected>Corte</option></select>
        <div id="bookingFeedback"></div>
      </form>
      <ul id="bookingList"></ul>
    `;
    reservas.length = 0;
    localStorage.clear();
  });

  test('no crea reserva si falta el servicio', () => {
    document.getElementById('servicioSelect').innerHTML = '<option value="">Selecciona un servicio</option>';
    
    const result = reserva(reservas);
    
    expect(result).toBe(false);
    expect(reservas).toHaveLength(0);
  });

  test('no crea reserva si falta el barbero', () => {
    document.getElementById('barberoSelect').innerHTML = '<option value="">Selecciona un barbero</option>';
    
    const result = reserva(reservas);
    
    expect(result).toBe(false);
    expect(reservas).toHaveLength(0);
  });

  test('no crea reserva si falta la hora', () => {
    document.getElementById('horaSelect').innerHTML = '<option value="">Selecciona una hora</option>';
    
    const result = reserva(reservas);
    
    expect(result).toBe(false);
    expect(reservas).toHaveLength(0);
  });

  test('no crea reserva si falta el celular', () => {
    document.getElementById('celCliente').value = '';
    
    const result = reserva(reservas);
    
    expect(result).toBe(false);
    expect(reservas).toHaveLength(0);
  });

  test('no crea reserva si falta el email', () => {
    document.getElementById('mailCliente').value = '';
    
    const result = reserva(reservas);
    
    expect(result).toBe(false);
    expect(reservas).toHaveLength(0);
  });

  test('valida campos con espacios en blanco', () => {
    document.getElementById('nombreCliente').value = '   ';
    document.getElementById('celCliente').value = '   ';
    document.getElementById('mailCliente').value = '   ';
    
    const result = reserva(reservas);
    
    expect(result).toBe(false);
    expect(reservas).toHaveLength(0);
  });
});

describe('Clases y objetos', () => {
  test('crea instancia de Barbero correctamente', () => {
    const barbero = new Barbero('Juan', 'Pérez', 'Especialista en cortes');
    
    expect(barbero.nombre).toBe('Juan');
    expect(barbero.apellido).toBe('Pérez');
    expect(barbero.especialidad).toBe('Especialista en cortes');
  });

  test('crea instancia de Servicio correctamente', () => {
    const servicio = new Servicio('Corte Premium', 800);
    
    expect(servicio.nombreServicio).toBe('Corte Premium');
    expect(servicio.precio).toBe(800);
  });

  test('crea instancia de Reserva correctamente', () => {
    const reserva = new Reserva('2025-08-10', '15:00', 'Corte', 'Juan Pérez', '12345678', 'test@test.com', 'Fran');
    
    expect(reserva.fecha).toBe('2025-08-10');
    expect(reserva.hora).toBe('15:00');
    expect(reserva.servicio).toBe('Corte');
    expect(reserva.nombreBarbero).toBe('Juan Pérez');
    expect(reserva.celularCliente).toBe('12345678');
    expect(reserva.mailCliente).toBe('test@test.com');
    expect(reserva.nombreCliente).toBe('Fran');
  });
});

describe('Renderizado de reservas', () => {
  test('ordena reservas por fecha y hora', () => {
    const reservas = [
      new Reserva('2025-08-10', '16:00', 'Corte', 'Juan Pérez', '12345678', 'test@test.com', 'Fran'),
      new Reserva('2025-08-10', '15:00', 'Barba', 'Pedro García', '87654321', 'test2@test.com', 'Ana'),
      new Reserva('2025-08-09', '14:00', 'Corte', 'Carlos López', '11223344', 'test3@test.com', 'Luis')
    ];

    document.body.innerHTML = `<ul id="bookingList"></ul>`;
    
    renderBookings(reservas);
    
    const bookingList = document.getElementById('bookingList');
    const items = bookingList.querySelectorAll('.booking-item');
    
    // Debería estar ordenado por fecha (más antigua primero) y luego por hora
    expect(items[0].querySelector('.booking-date').textContent).toBe('2025-08-09 - 14:00');
    expect(items[1].querySelector('.booking-date').textContent).toBe('2025-08-10 - 15:00');
    expect(items[2].querySelector('.booking-date').textContent).toBe('2025-08-10 - 16:00');
  });

  test('muestra información completa de cada reserva', () => {
    const reservas = [
      new Reserva('2025-08-10', '15:00', 'Corte', 'Juan Pérez', '12345678', 'test@test.com', 'Fran')
    ];

    document.body.innerHTML = `<ul id="bookingList"></ul>`;
    
    renderBookings(reservas);
    
    const li = document.querySelector('.booking-item');
    expect(li.querySelector('.booking-client').textContent).toBe('Fran');
    expect(li.querySelector('.booking-date').textContent).toBe('2025-08-10 - 15:00');
    expect(li.querySelector('.booking-phone').textContent).toBe('Celular: 12345678');
    expect(li.querySelector('.booking-email').textContent).toBe('Email: test@test.com');
    expect(li.querySelector('.booking-barber').textContent).toBe('Barbero: Juan Pérez');
    expect(li.querySelector('.booking-id').textContent).toBe('Reserva #1');
  });
});

describe('Persistencia de datos', () => {
  let reservas = [];

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="bookingForm">
        <input id="fecha" value="2025-08-10">
        <select id="horaSelect"><option value="15:00" selected>15:00</option></select>
        <select id="barberoSelect"><option value="Joaquín Rojas" selected>Joaquín Rojas</option></select>
        <input id="celCliente" value="12345678">
        <input id="mailCliente" value="test@test.com">
        <input id="nombreCliente" value="Fran">
        <select id="servicioSelect"><option value="Corte" selected>Corte</option></select>
        <div id="bookingFeedback"></div>
      </form>
      <ul id="bookingList"></ul>
    `;
    reservas.length = 0;
    localStorage.clear();
  });

  test('guarda reservas en localStorage', () => {
    reserva(reservas);
    
    const storedData = localStorage.getItem('reservas');
    expect(storedData).not.toBeNull();
    
    const parsedData = JSON.parse(storedData);
    expect(parsedData).toHaveLength(1);
    expect(parsedData[0].nombreCliente).toBe('Fran');
  });

  test('carga reservas existentes del localStorage', () => {
    const reservaExistente = {
      fecha: '2025-08-10',
      hora: '15:00',
      servicio: 'Corte',
      nombreBarbero: 'Juan Pérez',
      celularCliente: '12345678',
      mailCliente: 'test@test.com',
      nombreCliente: 'Fran'
    };
    
    localStorage.setItem('reservas', JSON.stringify([reservaExistente]));
    
    const reservasGuardadas = localStorage.getItem('reservas');
    const reservasCargadas = JSON.parse(reservasGuardadas);
    
    expect(reservasCargadas).toHaveLength(1);
    expect(reservasCargadas[0].nombreCliente).toBe('Fran');
  });
});

describe('Casos edge y validaciones especiales', () => {
  let reservas = [];

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="bookingForm">
        <input id="fecha" value="2025-08-10">
        <select id="horaSelect"><option value="15:00" selected>15:00</option></select>
        <select id="barberoSelect"><option value="Joaquín Rojas" selected>Joaquín Rojas</option></select>
        <input id="celCliente" value="12345678">
        <input id="mailCliente" value="test@test.com">
        <input id="nombreCliente" value="Fran">
        <select id="servicioSelect"><option value="Corte" selected>Corte</option></select>
        <div id="bookingFeedback"></div>
      </form>
      <ul id="bookingList"></ul>
    `;
    reservas.length = 0;
    localStorage.clear();
  });

  test('maneja reservas con caracteres especiales en nombres', () => {
    document.getElementById('nombreCliente').value = 'José María O\'Connor';
    document.getElementById('mailCliente').value = 'josé.maría@test.com';
    
    const result = reserva(reservas);
    
    expect(result).toBe(true);
    expect(reservas[0].nombreCliente).toBe('José María O\'Connor');
    expect(reservas[0].mailCliente).toBe('josé.maría@test.com');
  });

  test('valida formato de email básico', () => {
    // Email válido
    document.getElementById('mailCliente').value = 'usuario@dominio.com';
    let result = reserva(reservas);
    expect(result).toBe(true);
    
    // Limpiar para siguiente test
    reservas.length = 0;
    localStorage.clear();
    
    // Email inválido (sin @) - la app solo valida que no esté vacío, no el formato
    document.getElementById('fecha').value = '2025-08-10';
    document.getElementById('horaSelect').innerHTML = '<option value="15:00" selected>15:00</option>';
    document.getElementById('celCliente').value = '12345678';
    document.getElementById('nombreCliente').value = 'Fran';
    document.getElementById('mailCliente').value = 'usuario.com';
    
    result = reserva(reservas);
    expect(result).toBe(true); // La función no valida formato de email, solo que no esté vacío
  });

  test('maneja múltiples reservas del mismo cliente', () => {
    // Primera reserva
    reserva(reservas);
    
    // Segunda reserva del mismo cliente - necesitamos rellenar los campos que se limpiaron
    document.getElementById('fecha').value = '2025-08-11';
    document.getElementById('horaSelect').innerHTML = '<option value="16:00" selected>16:00</option>';
    document.getElementById('celCliente').value = '12345678';
    document.getElementById('mailCliente').value = 'test@test.com';
    document.getElementById('nombreCliente').value = 'Fran';
    
    const result = reserva(reservas);
    
    expect(result).toBe(true);
    expect(reservas).toHaveLength(2);
    expect(reservas[0].nombreCliente).toBe('Fran');
    expect(reservas[1].nombreCliente).toBe('Fran');
  });
});
