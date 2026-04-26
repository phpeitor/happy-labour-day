function obtenerParametroId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function decodificarId(id) {
    try {
        return atob(id);
    } catch (error) {
        return '';
    }
}

function actualizarMensajePersonalizado() {
    const id = obtenerParametroId();
    const dedicatoria = document.getElementById('dedicatoria');

    if (!dedicatoria) {
        return;
    }

    const nombre = id ? decodificarId(id) : '';

    if (nombre) {
        dedicatoria.textContent = `${nombre} agradecemos tu dedicacion y esfuerzo en tu trabajo`;
        return;
    }

    dedicatoria.textContent = 'Hoy celebramos el valor de cada oficio y cada esfuerzo diario.';
}

function iniciarFrasesRotativas() {
    const fraseRotativa = document.getElementById('frase-rotativa');

    if (!fraseRotativa) {
        return;
    }

    const frases = [
        'Gracias por construir futuro con tus manos.',
        'Gracias por cuidar, enseñar y servir cada dia.',
        'Gracias por mover al país(🇵🇪) con tu trabajo.'
    ];

    let indice = 0;
    fraseRotativa.textContent = frases[indice];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    window.setInterval(() => {
        fraseRotativa.classList.add('oculta');

        window.setTimeout(() => {
            indice = (indice + 1) % frases.length;
            fraseRotativa.textContent = frases[indice];
            fraseRotativa.classList.remove('oculta');
        }, 300);
    }, 3200);
}

function iniciarLanding() {
    actualizarMensajePersonalizado();
    iniciarFrasesRotativas();
}

window.addEventListener('load', iniciarLanding);
