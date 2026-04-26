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

function escribirTexto(elemento, texto, velocidad = 26) {
    if (!elemento) {
        return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        elemento.textContent = texto;
        return;
    }

    elemento.textContent = '';
    let indice = 0;

    const intervalo = window.setInterval(() => {
        elemento.textContent += texto.charAt(indice);
        indice += 1;

        if (indice >= texto.length) {
            window.clearInterval(intervalo);
        }
    }, velocidad);
}

function actualizarMensajePersonalizado() {
    const id = obtenerParametroId();
    const dedicatoria = document.getElementById('dedicatoria');

    if (!dedicatoria) {
        return;
    }

    const nombre = id ? decodificarId(id) : '';

    if (nombre) {
        escribirTexto(dedicatoria, `${nombre} agradecemos tu dedicacion y esfuerzo en tu trabajo`);
        return;
    }

    escribirTexto(dedicatoria, 'Hoy celebramos el valor de cada oficio y cada esfuerzo diario.');
}

function renderizarFrase(frase) {
    return frase.replace('[BANDERA_PE]', '<span class="flag-pe" role="img" aria-label="Bandera de Peru"></span>');
}

function iniciarFrasesRotativas() {
    const fraseRotativa = document.getElementById('frase-rotativa');

    if (!fraseRotativa) {
        return;
    }

    const frases = [
        'Gracias por construir futuro con tus manos.',
        'Gracias por cuidar, enseñar y servir cada dia.',
        'Gracias por impulsar al pais [BANDERA_PE] con tu trabajo.',
        'Hoy honramos la fuerza de todas y todos los trabajadores.'
    ];

    let indice = 0;
    fraseRotativa.innerHTML = renderizarFrase(frases[indice]);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    window.setInterval(() => {
        fraseRotativa.classList.add('oculta');

        window.setTimeout(() => {
            indice = (indice + 1) % frases.length;
            fraseRotativa.innerHTML = renderizarFrase(frases[indice]);
            fraseRotativa.classList.remove('oculta');
        }, 300);
    }, 3200);
}

function iniciarLanding() {
    actualizarMensajePersonalizado();
    iniciarFrasesRotativas();
}

window.addEventListener('load', iniciarLanding);
