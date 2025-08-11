import { actualizarHoras, reserva, reservas, fechaInput } from "./booking";

document
    .getElementById("barberoSelect")
    .addEventListener("change", () => {
        actualizarHoras(fechaInput.value);
    });

document
    .getElementById("fecha")
    .addEventListener("change", (e) => {
        actualizarHoras(e.target.value);
        horaSelect.value = "";
    });
document
    .getElementById("bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    reserva(reservas);
});