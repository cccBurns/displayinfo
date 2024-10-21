// ------FECHA Y CALENDARIO 

// Función para cambiar entre la vista de fecha y el calendario
document.getElementById('botonCambiarVista').addEventListener('click', function() {
    const vistaFecha = document.querySelector('.vista-fecha');
    const calendario = document.getElementById('calendario');
    const mesAnioCalendario = document.getElementById('mesAnioCalendario');

    if (vistaFecha.style.display === 'none') {
        vistaFecha.style.display = 'flex';
        calendario.style.display = 'none';
        // Actualizar vista de fecha
        actualizarVistaFecha();
    } else {
        vistaFecha.style.display = 'none';
        calendario.style.display = 'flex';
        generarCalendario();
        actualizarMesAnioCalendario();
    }
});

function actualizarVistaFecha() {
    const fechaActual = new Date();
    const opcionesDia = { weekday: 'long', day: 'numeric' };
    const opcionesMes = { month: 'long' };
    const opcionesAnio = { year: 'numeric' };

    const diaNumeroElemento = document.getElementById('diaNumero');
    const mesElemento = document.getElementById('mes');
    const anioElemento = document.getElementById('anio');

    diaNumeroElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesDia).toUpperCase();
    mesElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesMes).toUpperCase();
    anioElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesAnio);
}

// Función para generar el calendario
function generarCalendario() {
    const diasDelMes = document.getElementById('diasDelMes');
    diasDelMes.innerHTML = ''; // Limpia el contenido anterior
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    // Ajuste aquí para que el primer día sea correcto
    const primerDia = new Date(anio, mes, 1).getDay(); 
    const diasEnMes = new Date(anio, mes + 1, 0).getDate(); // Número total de días en el mes
    
    let diaActual = 1;
    for (let i = 0; i < 6; i++) { // Filas
        const fila = document.createElement('tr');
        for (let j = 0; j < 7; j++) { // Columnas
            const celda = document.createElement('td');
            
            if ((i === 0 && j < primerDia - 1) || diaActual > diasEnMes) {
                fila.appendChild(celda); // Añadir celdas vacías antes del primer día del mes
            } else {
                celda.textContent = diaActual;
                if (diaActual === fechaActual.getDate()) {
                    celda.classList.add('dia-actual'); // Resaltar el día actual
                }
                fila.appendChild(celda);
                diaActual++;
            }
        }
        diasDelMes.appendChild(fila);
    }
}

// Función para actualizar la fecha y hora
function actualizarFechaHora() {
    const diaNumeroElemento = document.getElementById('diaNumero');
    const mesElemento = document.getElementById('mes');
    const anioElemento = document.getElementById('anio');
    const horaElemento = document.getElementById('hora');

    const fechaActual = new Date();
    
    const opcionesDiaNumero = { weekday: 'long', day: 'numeric' };
    const opcionesMes = { month: 'long' };
    const opcionesAnio = { year: 'numeric' };
    
    diaNumeroElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesDiaNumero);
    mesElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesMes);
    anioElemento.textContent = fechaActual.toLocaleDateString('es-ES', opcionesAnio);

    const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    horaElemento.textContent = fechaActual.toLocaleTimeString('es-ES', opcionesHora);
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

// Actualiza la fecha y hora cada segundo
setInterval(actualizarFechaHora, 1000);
actualizarFechaHora(); // Llamada inicial

// ------CLIMA Y PRONOSTICO 

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
        const humidityElement = document.getElementById('humidity'); // Agregado para humedad
        const conditionElement = document.getElementById('condition');
        const iconElement = document.getElementById('weather-icon');
        
        const temperature = data.main.temp; // Temperatura actual
        const humidity = data.main.humidity; // Humedad actual
        const condition = data.weather[0].description; // Descripción del clima
        const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // URL de la imagen del clima

        // Mostrar la información en el HTML
        temperatureElement.textContent = `Temperatura: ${temperature}°C`;
        humidityElement.textContent = `Humedad: ${humidity}%`; // Mostrar la humedad
        conditionElement.textContent = `Condición: ${condition.charAt(0).toUpperCase() + condition.slice(1)}`;
        iconElement.src = icon; // URL directa de la imagen

        // Lógica para obtener el pronóstico
        obtenerPronostico();

    } catch (error) {
        console.error('Error:', error);
    }
}

async function obtenerPronostico() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`);
        
        if (!response.ok) {
            throw new Error('Error al obtener el pronóstico');
        }
        
        const data = await response.json();
        const pronosticos = data.list;

        // Obtener la hora actual
        const now = new Date();
        const currentHour = now.getHours();

        // Lógica para obtener el pronóstico de 2h, 4h, 6h y 8h
        const pronostico2h = pronosticos.find(p => new Date(p.dt * 1000).getHours() === (currentHour + 2) % 24);
        const pronostico4h = pronosticos.find(p => new Date(p.dt * 1000).getHours() === (currentHour + 4) % 24);
        const pronostico6h = pronosticos.find(p => new Date(p.dt * 1000).getHours() === (currentHour + 6) % 24);
        const pronostico8h = pronosticos.find(p => new Date(p.dt * 1000).getHours() === (currentHour + 8) % 24);

        // Actualizar el HTML con los pronósticos
        if (pronostico2h) {
            document.getElementById('hora-2h').textContent = `${new Date(pronostico2h.dt * 1000).getHours()}:00hs`;
            document.getElementById('temperature-2h').textContent = `${pronostico2h.main.temp}°C`;
            document.getElementById('condition-2h').textContent = pronostico2h.weather[0].description.charAt(0).toUpperCase() + pronostico2h.weather[0].description.slice(1);
        } else {
            document.getElementById('hora-2h').textContent = `-`;
            document.getElementById('temperature-2h').textContent = `-`;
            document.getElementById('condition-2h').textContent = `-`;
        }

        if (pronostico4h) {
            document.getElementById('hora-4h').textContent = `${new Date(pronostico4h.dt * 1000).getHours()}:00hs`;
            document.getElementById('temperature-4h').textContent = `${pronostico4h.main.temp}°C`;
            document.getElementById('condition-4h').textContent = pronostico4h.weather[0].description.charAt(0).toUpperCase() + pronostico4h.weather[0].description.slice(1);
        } else {
            document.getElementById('hora-4h').textContent = `-`;
            document.getElementById('temperature-4h').textContent = `-`;
            document.getElementById('condition-4h').textContent = `-`;
        }

        if (pronostico6h) {
            document.getElementById('hora-6h').textContent = `${new Date(pronostico6h.dt * 1000).getHours()}:00hs`;
            document.getElementById('temperature-6h').textContent = `${pronostico6h.main.temp}°C`;
            document.getElementById('condition-6h').textContent = pronostico6h.weather[0].description.charAt(0).toUpperCase() + pronostico6h.weather[0].description.slice(1);
        } else {
            document.getElementById('hora-6h').textContent = `-`;
            document.getElementById('temperature-6h').textContent = `-`;
            document.getElementById('condition-6h').textContent = `-`;
        }

        if (pronostico8h) {
            document.getElementById('hora-8h').textContent = `${new Date(pronostico8h.dt * 1000).getHours()}:00hs`;
            document.getElementById('temperature-8h').textContent = `${pronostico8h.main.temp}°C`;
            document.getElementById('condition-8h').textContent = pronostico8h.weather[0].description.charAt(0).toUpperCase() + pronostico8h.weather[0].description.slice(1);
        } else {
            document.getElementById('hora-8h').textContent = `-`;
            document.getElementById('temperature-8h').textContent = `-`;
            document.getElementById('condition-8h').textContent = `-`;
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Llamada inicial para obtener el clima
obtenerClima();

// Actualiza el clima cada 10 minutos
setInterval(obtenerClima, 600000);


// ------ CARRUSEL Y PARTIDOS 

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
