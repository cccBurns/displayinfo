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
// Función para obtener el clima actual y el pronóstico
const apiKey = '2abe0509728e9c6f401eb355c235c6c0'; // Tu clave de API
const ciudad = 'Buenos Aires'; // Cambia a la ciudad deseada

async function obtenerClima() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`);
        
        if (!response.ok) {
            throw new Error('Error al obtener el clima');
        }
        
        const data = await response.json();
        
        // Elementos del clima actual
        document.getElementById('temperature').textContent = `Temperatura: ${Math.round(data.main.temp)}°C`;
        document.getElementById('humidity').textContent = `Humedad: ${data.main.humidity}%`;
        document.getElementById('condition').textContent = `Condición: ${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}`;
        document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

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

        // Asegúrate de que solo tomamos las predicciones de los próximos días
        for (let i = 1; i <= 4; i++) { // Cambia el límite si quieres más o menos pronósticos
            const pronostico = pronosticos[i * 8]; // 8 porque cada pronóstico es cada 3 horas
            
            // Datos para el pronóstico diario
            const fecha = new Date(pronostico.dt * 1000);
            const opciones = { weekday: 'long' }; // Obtener el nombre del día
            const dia = fecha.toLocaleDateString('es-ES', opciones).toUpperCase(); // Nombre del día
            document.getElementById(`hora-${i * 24}h`).textContent = dia; // Nombre del día
            
            // Aquí se asegura de que se tomen valores diferentes para max y min
            const maxTemp = Math.round(pronosticos.slice(i * 8 - 8, i * 8).reduce((max, p) => Math.max(max, p.main.temp_max), -Infinity));
            const minTemp = Math.round(pronosticos.slice(i * 8 - 8, i * 8).reduce((min, p) => Math.min(min, p.main.temp_min), Infinity));
            
            document.getElementById(`temperature-${i * 24}h`).innerHTML = `Max: ${maxTemp}°C<br>Min: ${minTemp}°C`; // Temperatura del día
            document.getElementById(`condition-${i * 24}h`).textContent = pronostico.weather[0].description.charAt(0).toUpperCase() + pronostico.weather[0].description.slice(1); // Condición del día
            document.getElementById(`weather-icon-${i * 24}h`).src = `http://openweathermap.org/img/wn/${pronostico.weather[0].icon}@2x.png`; // Icono del clima
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
