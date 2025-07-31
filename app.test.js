<<<<<<< HEAD
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
=======


test('Cargar selects de barberos en reserva', function () {
    const resultado  = loadSelects();
    expect(resultado).toEqual('<option value="" disabled="">Selecciona un barbero</option><option value="Joaquín Rojas">Joaquín Rojas - Especialista en fades</option><option value="Matías Suárez">Matías Suárez - Maestro de navaja</option><option value="Ignacio Pereira">Ignacio Pereira - Artista de barbas</option><option value="Sebastián Delgado">Sebastián Delgado - Colorista profesional</option><option value="Lucas Méndez">Lucas Méndez - Terapeuta capilar</option><option value="Diego Montes">Diego Montes - Estilista vintage</option>');
})
>>>>>>> 1eb51e50d13f68a0b69738af70391258e6d1bfcb
