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

    const cursorElem = document.getElementById('cursor-dedicatoria');
    elemento.textContent = '';
    let indice = 0;

    const intervalo = window.setInterval(() => {
        elemento.textContent += texto.charAt(indice);
        indice += 1;

        if (indice >= texto.length) {
            window.clearInterval(intervalo);
            if (cursorElem) {
                cursorElem.style.display = 'none';
            }
        } else if (cursorElem) {
            cursorElem.style.display = 'inline-block';
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
    const progressBar = document.getElementById('progress-bar');

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
    fraseRotativa.classList.add('visible');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const cicloMs = 3200;
    const transicionMs = 300;
    const visibleMs = cicloMs - transicionMs * 2;

    const iniciarProgreso = () => {
        if (progressBar) {
            progressBar.style.animation = 'none';
            progressBar.offsetHeight;
            progressBar.style.animation = `progressFill ${visibleMs}ms linear`;
        }
    };

    iniciarProgreso();

    window.setInterval(() => {
        fraseRotativa.classList.remove('visible');

        window.setTimeout(() => {
            indice = (indice + 1) % frases.length;
            fraseRotativa.innerHTML = renderizarFrase(frases[indice]);
            fraseRotativa.classList.add('visible');
            iniciarProgreso();
        }, transicionMs);
    }, cicloMs);
}

const estilosProgreso = `
    @keyframes progressFill {
        0% {
            width: 0;
        }
        100% {
            width: 100%;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = estilosProgreso;
document.head.appendChild(styleSheet);

function iniciarLanding() {
    actualizarMensajePersonalizado();
    iniciarFrasesRotativas();
}

window.addEventListener('load', iniciarLanding);
