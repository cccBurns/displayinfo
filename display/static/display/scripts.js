// Función para actualizar la fecha y hora
function actualizarFechaHora() {
    const diaNumeroElemento = document.getElementById('diaNumero');
    const mesElemento = document.getElementById('mes');
    const anioElemento = document.getElementById('anio');
    const horaElemento = document.getElementById('hora');

    const fechaActual = new Date();
    
    // Formato de fecha: Día, Mes, Año
    const opcionesDiaNumero = { weekday: 'long', day: 'numeric' };
    const opcionesMes = { month: 'long' };
    const opcionesAnio = { year: 'numeric' };
    
    diaNumeroElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesDiaNumero);
    mesElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesMes);
    anioElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesAnio);

    // Formato de hora: HH:MM:SS
    const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    horaElemento.textContent = fechaActual.toLocaleTimeString('es-ES', opcionesHora);
}

// Actualiza la fecha y hora cada segundo
setInterval(actualizarFechaHora, 1000);
actualizarFechaHora(); // Llamada inicial

// Código para obtener el clima
const apiKey = '2abe0509728e9c6f401eb355c235c6c0'; // Tu clave de API
const ciudad = 'Buenos Aires'; // Cambia a la ciudad deseada

async function obtenerClima() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`);
        
        if (!response.ok) {
            throw new Error('Error al obtener el clima');
        }
        
        const data = await response.json();
        
        const temperatureElement = document.getElementById('temperature');
        const conditionElement = document.getElementById('condition');
        const iconElement = document.getElementById('weather-icon');
        
        const temperature = data.main.temp; // Temperatura actual
        const condition = data.weather[0].description; // Descripción del clima
        const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // URL de la imagen del clima

        // Mostrar la información en el HTML
        temperatureElement.textContent = `Temperatura Actual: ${temperature}°C`;
        conditionElement.textContent = `Condición: ${condition.charAt(0).toUpperCase() + condition.slice(1)}`;
        iconElement.src = icon; // URL directa de la imagen
    } catch (error) {
        console.error('Error:', error);
    }
}

// Llamada inicial para obtener el clima
obtenerClima();

// Actualiza el clima cada 10 minutos
setInterval(obtenerClima, 600000);

// Lógica para el carrusel
let index = 0;
const carouselItems = document.querySelectorAll('.carousel-item');

// Función para mostrar partidos
function mostrarPartidos() {
    const hoy = new Date();
    const partidosParaHoy = obtenerPartidosParaFecha(hoy);
    const partidosFuturos = obtenerPartidosFuturos(hoy);

    // Limpiar el contenido anterior
    carouselItems.forEach(item => item.innerHTML = '');

    if (partidosParaHoy.length > 0) {
        // Mostrar partidos de hoy
        mostrarPartidosEnCarrusel('Partidos de Hoy', partidosParaHoy, 0);
    } else if (partidosFuturos.length > 0) {
        // Si no hay partidos para hoy, mostrar los próximos partidos
        mostrarPartidosEnCarrusel('Próximos Partidos', partidosFuturos, 0);
    } else {
        // Si no hay partidos en ninguno de los días, mostrar un mensaje
        carouselItems[0].innerHTML = '<div>No hay partidos programados en los próximos días.</div>';
    }

    // Lógica para el carrusel
    carouselItems.forEach(item => item.style.display = 'none'); // Ocultar todos
    carouselItems[index].style.display = 'block'; // Mostrar el elemento actual
    index = (index + 1) % carouselItems.length; // Cambiar al siguiente elemento
}

// Función para obtener partidos para una fecha específica
function obtenerPartidosParaFecha(fecha) {
    const partidos = {
        premierLeague: [
            { partido: 'Arsenal vs Chelsea', fecha: new Date('2024-10-20T12:30:00') },
            { partido: 'Liverpool vs Manchester City', fecha: new Date('2024-10-20T15:00:00') },
        ],
        ligaArgentina: [
            { partido: 'Boca Juniors vs River Plate', fecha: new Date('2024-10-20T17:00:00') },
            { partido: 'San Lorenzo vs Racing', fecha: new Date('2024-10-20T19:30:00') },
        ],
        mls: [
            { partido: 'Inter de Miami vs New York City', fecha: new Date('2024-10-20T21:00:00') },
            { partido: 'LA Galaxy vs Austin FC', fecha: new Date('2024-10-20T22:30:00') },
        ],
    };

    let partidosParaHoy = [];

    Object.entries(partidos).forEach(([liga, listaPartidos]) => {
        listaPartidos.forEach(partido => {
            if (partido.fecha.toDateString() === fecha.toDateString()) {
                partidosParaHoy.push({ ...partido, liga });
            }
        });
    });

    return partidosParaHoy;
}

// Función para obtener partidos futuros
function obtenerPartidosFuturos(fecha) {
    const partidos = {
        premierLeague: [
            { partido: 'Arsenal vs Chelsea', fecha: new Date('2024-10-20T12:30:00') },
            { partido: 'Liverpool vs Manchester City', fecha: new Date('2024-10-20T15:00:00') },
        ],
        ligaArgentina: [
            { partido: 'Boca Juniors vs River Plate', fecha: new Date('2024-10-20T17:00:00') },
            { partido: 'San Lorenzo vs Racing', fecha: new Date('2024-10-20T19:30:00') },
        ],
        mls: [
            { partido: 'Inter de Miami vs New York City', fecha: new Date('2024-10-20T21:00:00') },
            { partido: 'LA Galaxy vs Austin FC', fecha: new Date('2024-10-20T22:30:00') },
        ],
    };

    let partidosFuturos = [];

    Object.entries(partidos).forEach(([liga, listaPartidos]) => {
        listaPartidos.forEach(partido => {
            if (partido.fecha > fecha) {
                partidosFuturos.push({ ...partido, liga });
            }
        });
    });

    return partidosFuturos;
}

// Función para mostrar partidos en el carrusel
function mostrarPartidosEnCarrusel(nombreLiga, partidos, index) {
    const carouselItem = carouselItems[index];
    carouselItem.innerHTML = `<div class="liga">${nombreLiga}</div>`; // Mostrar el nombre de la liga
    partidos.forEach(partido => {
        const partidoElement = document.createElement('div');
        const fechaPartido = partido.fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        partidoElement.textContent = `${partido.partido} - ${fechaPartido} - ${partido.fecha.getHours()}:${partido.fecha.getMinutes().toString().padStart(2, '0')} hs`;
        carouselItem.appendChild(partidoElement);
    });
}

// Llamada inicial para mostrar los partidos en el carrusel
mostrarPartidos();
setInterval(mostrarPartidos, 10000); // Cambia cada 10 segundos
