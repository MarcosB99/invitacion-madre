document.addEventListener("DOMContentLoaded", function () {
    // 1. Configuración del IntersectionObserver para animaciones de scroll
    const revealElements = document.querySelectorAll(".reveal");

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
    };

    const scrollObserver = new IntersectionObserver(function (
        entries,
        observer,
    ) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => {
        scrollObserver.observe(el);
    });

    // 2. Interacción del botón RSVP (Ejemplo)
    const btnConfirmar = document.getElementById("btn-confirmar");
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", function (e) {
            // Solo como efecto visual por ahora si no hay link:
            if (this.getAttribute("href") === "#") {
                e.preventDefault();
                this.innerHTML = "¡Gracias por confirmar!";
                this.style.backgroundColor = "var(--principal-text)";
                this.style.color = "var(--ivory)";
                this.style.pointerEvents = "none";
            }
        });
    }
});

const audio = document.getElementById("musica-fondo");
const btnMusica = document.getElementById("btn-musica");
const textoMusica = document.getElementById("texto-musica");
let isPlaying = false;

// Bajar un poco el volumen para que sea ambiental y no ensordecedor
audio.volume = 0.4;

btnMusica.addEventListener("click", function () {
    if (isPlaying) {
        audio.pause();
        textoMusica.innerHTML = "🎵 Reproducir Música";
    } else {
        audio.play();
        textoMusica.innerHTML = "🎵 Pausar Música";
    }
    isPlaying = !isPlaying;
});

// Truco extra: intentar reproducir al primer toque en la pantalla
document.body.addEventListener(
    "click",
    function () {
        if (!isPlaying) {
            audio
                .play()
                .then(() => {
                    isPlaying = true;
                    textoMusica.innerHTML = "🎵 Pausar Música";
                })
                .catch((err) => {
                    // El navegador bloqueó el autoplay, esperamos a que use el botón
                    console.log("Esperando interacción manual para el audio.");
                });
        }
    },
    { once: true },
); // El { once: true } hace que este evento se ejecute solo una vez

document.addEventListener("DOMContentLoaded", function () {
    // --------------------------------------------------
    // LÓGICA DEL CALENDARIO
    // --------------------------------------------------
    const btnCalendario = document.getElementById("btn-calendario");
    const modalCalendario = document.getElementById("modal-calendario");

    // 1. Mostrar/Ocultar el menú al tocar la fecha
    if (btnCalendario) {
        btnCalendario.addEventListener("click", function (e) {
            e.stopPropagation(); // Evita que se cierre instantáneamente
            modalCalendario.classList.toggle("active");
        });
    }

    // 2. Cerrar el menú si tocan en cualquier otra parte de la pantalla
    document.addEventListener("click", function (e) {
        if (
            modalCalendario &&
            !modalCalendario.contains(e.target) &&
            !btnCalendario.contains(e.target)
        ) {
            modalCalendario.classList.remove("active");
        }
    });

    // 3. Generar los enlaces del evento (¡Edita el año si es necesario!)
    // Formato de fecha para calendarios: YYYYMMDDTHHmmss (Año, Mes, Día, T, Hora, Minuto, Segundo)
    const inicioEvento = "20261121T080000";
    const finEvento = "20261121T110000"; // Asumiendo que dura 3 horas (hasta las 11:00 AM)

    const titulo = "Graduación de Mamá";
    const detalles =
        "Comida de agradecimiento y celebración por la graduación. ¡Nos emociona mucho compartir este momento contigo!";
    const ubicacion = "VILLAS MAGEN NARANJO";

    // --- ENLACE PARA GOOGLE CALENDAR ---
    const urlGoogle = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${inicioEvento}/${finEvento}&details=${encodeURIComponent(detalles)}&location=${encodeURIComponent(ubicacion)}`;
    document.getElementById("cal-google").href = urlGoogle;

    // --- ARCHIVO PARA APPLE CALENDAR / OUTLOOK (.ics) ---
    // Creamos el formato estándar iCalendar
    const contenidoIcs = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${titulo}
DTSTART:${inicioEvento}
DTEND:${finEvento}
LOCATION:${ubicacion}
DESCRIPTION:${detalles}
END:VEVENT
END:VCALENDAR`;

    // Convertimos el texto en un archivo descargable temporal
    const blob = new Blob([contenidoIcs], {
        type: "text/calendar;charset=utf-8",
    });
    const urlIcs = window.URL.createObjectURL(blob);
    const linkApple = document.getElementById("cal-apple");

    linkApple.href = urlIcs;
    linkApple.download = "celebracion-graduacion.ics"; // Nombre del archivo que se descarga
});