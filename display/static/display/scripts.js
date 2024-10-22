// ------FECHA Y CALENDARIO 

// Función para cambiar entre la vista de fecha y el calendario
document.getElementById('botonCambiarVista').addEventListener('click', function() {
    const vistaFecha = document.querySelector('.vista-fecha');
    const calendario = document.getElementById('calendario');
    const mesAnioCalendario = document.getElementById('mesAnioCalendario');
    const body = document.body;

    if (vistaFecha.style.display === 'none') {
        vistaFecha.style.display = 'flex';
        calendario.style.display = 'none';
        body.classList.remove('no-scroll'); // Eliminar clase al volver a la vista de fecha
        actualizarVistaFecha();
    } else {
        vistaFecha.style.display = 'none';
        calendario.style.display = 'flex';
        body.classList.add('no-scroll'); // Agregar clase para evitar desplazamiento
        generarCalendario();
        actualizarMesAnioCalendario();
    }
});

// Función para actualizar la vista de fecha
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

// Nueva función para actualizar el mes y año del calendario
function actualizarMesAnioCalendario() {
    const fechaActual = new Date();
    const opcionesMes = { month: 'long', year: 'numeric' };
    const mesAnioCalendario = document.getElementById('mesAnioCalendario');
    
    // Modificación aquí: eliminamos 'de' y convertimos a mayúsculas
    const mesAnioTexto = fechaActual.toLocaleDateString('es-ES', opcionesMes).replace('de', '').trim().toUpperCase();
    
    mesAnioCalendario.textContent = mesAnioTexto; // Actualizamos el texto en el elemento
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
document.addEventListener("DOMContentLoaded", function () {
    // Tu API Token
    const apiToken = '3838dae2791e4ffbb37e57df3256bf92';

    // Ligas y sus correspondientes IDs en football-data.org
    const leagues = {
        'premier-league': 2021,      // Premier League
        'liga-argentina': 2014,      // Liga Argentina
        'mls': 2016,                 // Major League Soccer (MLS)
        'libertadores': 2139         // Copa Libertadores
    };

    // Obtener los partidos de todas las ligas
    function fetchMatches(leagueName, leagueId) {
        const url = `https://api.football-data.org/v4/competitions/${leagueId}/matches?status=SCHEDULED`;

        fetch(url, {
            headers: {
                'X-Auth-Token': apiToken
            }
        })
        .then(response => response.json())
        .then(data => {
            const matches = data.matches;
            if (matches && matches.length > 0) {
                displayMatches(leagueName, matches);
            } else {
                document.querySelector(`#${leagueName}`).innerHTML = '<p>No hay partidos programados.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
            document.querySelector(`#${leagueName}`).innerHTML = '<p>Error al cargar partidos.</p>';
        });
    }

    // Mostrar los partidos en el carrusel
    function displayMatches(leagueName, matches) {
        const leagueDiv = document.querySelector(`#${leagueName}`);
        leagueDiv.innerHTML = ''; // Limpiar cualquier contenido previo

        matches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.classList.add('match-item');
            
            const homeTeam = match.homeTeam.name;
            const awayTeam = match.awayTeam.name;
            const date = new Date(match.utcDate).toLocaleString();

            matchElement.innerHTML = `
                <p>${homeTeam} vs ${awayTeam}</p>
                <p>Fecha: ${date}</p>
            `;

            leagueDiv.appendChild(matchElement);
        });
    }

    // Llamar a la API para todas las ligas
    Object.keys(leagues).forEach(leagueName => {
        fetchMatches(leagueName, leagues[leagueName]);
    });

    // Rotación del carrusel (cada 10 segundos)
    let currentIndex = 0;
    const carouselItems = document.querySelectorAll('.carousel-item');
    setInterval(() => {
        carouselItems.forEach((item, index) => {
            item.style.display = index === currentIndex ? 'block' : 'none';
        });
        currentIndex = (currentIndex + 1) % carouselItems.length;
    }, 10000); // 10 segundos
});
