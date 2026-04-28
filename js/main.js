function obtenerParametroId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function codificarId(texto) {
    try {
        const bytes = new TextEncoder().encode(texto);
        let binario = '';

        bytes.forEach((byte) => {
            binario += String.fromCharCode(byte);
        });

        return btoa(binario);
    } catch (error) {
        return btoa(texto);
    }
}

function decodificarId(id) {
    try {
        const binario = atob(id);
        const bytes = Uint8Array.from(binario, (char) => char.charCodeAt(0));

        return new TextDecoder().decode(bytes);
    } catch (error) {
        try {
            return atob(id);
        } catch (fallbackError) {
            return '';
        }
    }
}

function capitalizeName(name) {
    if (!name) return '';
    const trimmed = name.trim();
    if (!trimmed) return '';
    const lower = trimmed.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
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
        escribirTexto(dedicatoria, `${nombre} agradecemos tu dedicación y esfuerzo.`);
        return;
    }

    escribirTexto(dedicatoria, 'Hoy celebramos el valor de cada oficio y cada esfuerzo diario.');
}

function inicializarFormularioNombre() {
    const form = document.getElementById('nombre-form');
    const input = document.getElementById('nombre-input');
    const botonActualizar = document.getElementById('actualizar-nombre');
    const botonEliminar = document.getElementById('eliminar-nombre');

    if (!form || !input || !botonActualizar || !botonEliminar) {
        return;
    }

    const idActual = obtenerParametroId();
    const nombreActual = idActual ? decodificarId(idActual) : '';

    const mostrarFormulario = () => {
        form.classList.remove('oculto');
        botonActualizar.classList.add('oculto');
        botonEliminar.classList.add('oculto');
    };

    const ocultarFormulario = () => {
        form.classList.add('oculto');
        botonActualizar.classList.remove('oculto');
        botonEliminar.classList.remove('oculto');
    };

    if (nombreActual) {
        // normalizar visualmente el nombre existente
        input.value = capitalizeName(nombreActual);
        ocultarFormulario();
    } else {
        mostrarFormulario();
    }

    botonActualizar.addEventListener('click', () => {
        mostrarFormulario();
        input.focus();
        input.select();
    });

    // Validación en tiempo real: evitar espacios y caracteres no permitidos
    input.addEventListener('keydown', (e) => {
        // impedir la tecla espacio
        if (e.key === ' ') {
            e.preventDefault();
            return;
        }
    });

    // Manejar pegado: sanitizar texto pegado
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
        const sanitized = paste.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/gu, '');
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const before = input.value.slice(0, start);
        const after = input.value.slice(end);
        input.value = before + sanitized + after;
        input.dispatchEvent(new Event('input'));
    });

    // Input: eliminar espacios y caracteres no alfabéticos en tiempo real
    input.addEventListener('input', () => {
        const cleaned = input.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/gu, '');
        if (input.value !== cleaned) {
            input.value = cleaned;
        }
        // limpiar mensaje de validación previo en cuanto el usuario edita
        input.setCustomValidity('');
    });

    // capitalizar al perder el foco
    input.addEventListener('blur', () => {
        input.value = capitalizeName(input.value.trim());
    });

    botonEliminar.addEventListener('click', () => {
        const rutaActual = window.location.pathname.replace(/index\.html$/i, '');
        const baseRuta = rutaActual.endsWith('/') ? rutaActual : `${rutaActual}/`;
        window.location.href = baseRuta;
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // limpiar mensajes de validación anteriores
        input.setCustomValidity('');

        const raw = input.value.trim();
        if (!raw) {
            input.setCustomValidity('Ingrese un nombre');
            input.reportValidity();
            input.focus();
            return;
        }

        // validar: sólo una palabra (sin espacios) compuesta por letras (incluye acentos)
        const singleName = raw.replace(/\s+/g, '');
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/u;
        if (!nameRegex.test(singleName)) {
            input.setCustomValidity('Ingrese sólo un nombre (sin espacios ni números)');
            input.reportValidity();
            input.focus();
            return;
        }

        const nombre = capitalizeName(singleName);
        input.value = nombre;

        const idCodificado = codificarId(nombre);
        ocultarFormulario();
        const rutaActual = window.location.pathname.replace(/index\.html$/i, '');
        const baseRuta = rutaActual.endsWith('/') ? rutaActual : `${rutaActual}/`;
        window.location.href = `${baseRuta}?id=${encodeURIComponent(idCodificado)}`;
    });
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
    inicializarFormularioNombre();
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
