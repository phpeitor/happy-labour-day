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

// ===================== Logo Lightbox =====================
(function () {
    const logoEl = document.querySelector('.logo');
    if (!logoEl) return;
    const logoImg = logoEl.querySelector('.box img');
    if (!logoImg) return;

    logoEl.addEventListener('click', function () {
        if (document.querySelector('.logo-lightbox')) {
            return;
        }

        const rect = logoEl.getBoundingClientRect();
        const logoCX = rect.left + rect.width / 2;
        const logoCY = rect.top + rect.height / 2;
        const vpCX = window.innerWidth / 2;
        const vpCY = window.innerHeight / 2;
        const dx = logoCX - vpCX;
        const dy = logoCY - vpCY;

        const overlay = document.createElement('div');
        overlay.className = 'logo-lightbox';
        overlay.style.setProperty('--lbx', dx + 'px');
        overlay.style.setProperty('--lby', dy + 'px');

        const img = document.createElement('img');
        img.src = logoImg.src;
        img.className = 'logo-lightbox__img';
        img.alt = 'Logo';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'logo-lightbox__close';
        closeBtn.setAttribute('aria-label', 'Cerrar');
        closeBtn.innerHTML = '&times;';

        overlay.appendChild(img);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                overlay.classList.add('logo-lightbox--open');
            });
        });

        function onKey(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        }

        function closeLightbox() {
            document.removeEventListener('keydown', onKey);
            overlay.classList.remove('logo-lightbox--open');
            overlay.classList.add('logo-lightbox--closing');
            window.setTimeout(function () {
                overlay.remove();
            }, 420);
        }

        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeLightbox();
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeLightbox();
        });

        document.addEventListener('keydown', onKey);
    });
}());

window.addEventListener('load', iniciarLanding);
