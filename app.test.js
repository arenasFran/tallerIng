

test('Cargar selects de barberos en reserva', function () {
    const resultado  = loadSelects();
    expect(resultado).toEqual('<option value="" disabled="">Selecciona un barbero</option><option value="Joaquín Rojas">Joaquín Rojas - Especialista en fades</option><option value="Matías Suárez">Matías Suárez - Maestro de navaja</option><option value="Ignacio Pereira">Ignacio Pereira - Artista de barbas</option><option value="Sebastián Delgado">Sebastián Delgado - Colorista profesional</option><option value="Lucas Méndez">Lucas Méndez - Terapeuta capilar</option><option value="Diego Montes">Diego Montes - Estilista vintage</option>');
})