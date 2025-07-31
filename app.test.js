import { loadSelects, Barbero, Servicio } from './app.js';

test('loadSelects carga correctamente barberos y servicios', () => {
  document.body.innerHTML = `
    <select id="servicioSelect"></select>
    <select id="barberoSelect"></select>
  `;

  loadSelects(
    [new Barbero('Juan', 'Pérez', 'Fades')],
    [new Servicio('Corte', 500)]
  );

  const servicioSelect = document.getElementById('servicioSelect');
  const barberoSelect = document.getElementById('barberoSelect');

  expect(servicioSelect.children.length).toBe(2); // placeholder + 1 opción
  expect(servicioSelect.children[1].textContent).toBe('Corte ($500)');

  expect(barberoSelect.children.length).toBe(2);
  expect(barberoSelect.children[1].textContent).toBe('Juan Pérez - Fades');
});
