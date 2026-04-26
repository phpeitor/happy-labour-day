function obtenerParametroId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function actualizarMensaje() {
    const id = obtenerParametroId();
    const mensaje = document.getElementById('mensaje');

    if (!mensaje) {
        return;
    }

    if (id) {
        mensaje.innerHTML += `<small>${atob(id)} agradece tu dedicacion y esfuerzo en tu labor</small>`;
    } else {
        mensaje.innerHTML += '<small>Recuerda que hoy no vas a a trabajar...</small>';
    }
}

window.addEventListener('load', actualizarMensaje);
