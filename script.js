document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.opcionOperacion');

    botones.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            mostrarNuevoContenedorOperacion(evento.target);
        });
    });
});

function mostrarNuevoContenedorOperacion(botonOrigen){
    const contenedorPanelOperacion = document.getElementById('panelOperacion');
    const accionBoton = botonOrigen.id;
    if (accionBoton === 'verStock'){
        mostrarStock(contenedorPanelOperacion);
    } else if (accionBoton === 'registrarCompra'){
        registrarCompra(contenedorPanelOperacion);
    } else if (accionBoton === 'ingresarMaterial'){
        calcularIngresarMaterial(contenedorPanelOperacion);
    }
}

// Función para mostrar el stock
async function mostrarStock(contenedorPanelOperacion) {
    document.getElementById('panelOperacion').innerHTML = `<h3>Consultar Stock</h3>`;
    
    try {
        // Realizar fetch para obtener los datos del stock desde el archivo PHP
        const response = await fetch('obtenerStock.php');
        const stock = await response.json(); // Convertir la respuesta a formato JSON

        // Recorrer los productos obtenidos y agregarlos al contenedor
        stock.forEach(producto => {
            let itemProductoStock = document.createElement('li');
            itemProductoStock.textContent = `${producto.nombre_producto}: ${producto.cantidad_producto} en stock`;
            contenedorPanelOperacion.appendChild(itemProductoStock);
        });
    } catch (error) {
        console.error('Error al obtener el stock:', error);
    }
}

// Función para registrar una nueva compra
function registrarCompra(contenedorPanelOperacion) {
    contenedorPanelOperacion.innerHTML = `<h3>Elija el tipo de compra a realizar</h3>`;
    const botonCompraSuelta = document.createElement('button');
    botonCompraSuelta.textContent = 'Compra suelta';
    botonCompraSuelta.className = 'opcionRegistroCompra';
    botonCompraSuelta.id = 'botonCompraSuelta';

    const botonCompraKit = document.createElement('button');
    botonCompraKit.textContent = 'Compra de Kit o familia de equipamiento';
    botonCompraKit.className = 'opcionRegistroCompra';
    botonCompraKit.id = 'botonCompraKit';

    contenedorPanelOperacion.appendChild(botonCompraSuelta);
    contenedorPanelOperacion.appendChild(botonCompraKit);

    botonCompraSuelta.addEventListener('click', () => {
        mostrarFormularioCompraSuelta(contenedorPanelOperacion);
    });
    botonCompraKit.addEventListener('click', () => {
        mostrarFormularioCompraKit(contenedorPanelOperacion);
    });
}

async function mostrarFormularioCompraSuelta(contenedorPanelOperacion) {
    const formularioCompraSuelta = document.createElement('form');
    formularioCompraSuelta.innerHTML = `<h3>Registrar Compra Suelta</h3>`;
    formularioCompraSuelta.id = 'formCompraSuelta';

    try {
        const response = await fetch('obtenerStock.php');
        const stock = await response.json();

        stock.forEach(producto => {
            const etiquetaCampo = document.createElement('label');
            etiquetaCampo.textContent = `${producto.nombre_producto} (${producto.cantidad_producto} disponibles)`;
            etiquetaCampo.setAttribute('for', `cantidad-${producto.nombre_producto}`);
            formularioCompraSuelta.appendChild(etiquetaCampo);

            const selectorCantidad = document.createElement('input');
            selectorCantidad.type = 'number';
            selectorCantidad.min = 0;
            selectorCantidad.max = producto.cantidad_producto;
            selectorCantidad.id = `${producto.nombre_producto}`;
            selectorCantidad.placeholder = `0`;
            formularioCompraSuelta.appendChild(selectorCantidad);
        });

        // Botón para enviar el formulario
        const botonSubmitSuelta = document.createElement('button');
        botonSubmitSuelta.type = 'submit'; // Cambiar a tipo submit para enviar el formulario
        botonSubmitSuelta.textContent = 'Registrar Compra';
        formularioCompraSuelta.appendChild(botonSubmitSuelta);

        // Botón para cancelar
        const botonCancelarRegistro = document.createElement('button');
        botonCancelarRegistro.type = 'button'; // Tipo button para cancelar
        botonCancelarRegistro.textContent = 'Cancelar';
        botonCancelarRegistro.addEventListener('click', () => {
            formularioCompraSuelta.reset(); // Reinicia el formulario
        });
        formularioCompraSuelta.appendChild(botonCancelarRegistro);

        // Añadir el formulario al contenedor principal
        contenedorPanelOperacion.appendChild(formularioCompraSuelta);
    } catch (error) {
        console.error('Error al obtener el stock:', error);
    }
}


function mostrarFormularioCompraSuelta(){
    
}

//funcion para cambiar el stock, ya sea para agregar en caso de que entre nuevo material o para quitar si se ha registrado una compra
