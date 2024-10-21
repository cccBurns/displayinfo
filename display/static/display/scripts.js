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
