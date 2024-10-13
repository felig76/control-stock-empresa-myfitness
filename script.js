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
    const botonSuelta = document.createElement('button');
    botonSuelta.textContent = 'Compra suelta';
    botonSuelta.className = 'opcionRegistroCompra';
    botonSuelta.id = 'compraSuelta';

    const botonKit = document.createElement('button');
    botonKit.textContent = 'Compra de Kit o familia de equipamiento';
    botonKit.className = 'opcionRegistroCompra';
    botonKit.id = 'compraKit';

    contenedor.appendChild(botonSuelta);
    contenedor.appendChild(botonKit);

    // Añadir eventos a los botones
    botonSuelta.addEventListener('click', () => {
        mostrarFormularioCompraSuelta(contenedor);
    });

    botonKit.addEventListener('click', () => {
        mostrarFormularioCompraKit(contenedor);
    });
}

function mostrarFormularioCompraSuelta(contenedorPanelOperacion){
    formularioCompraSuelta.innerHTML = `<h3>Registrar Compra Suelta</h3>`
    const formularioCompraSuelta = document.createElement('form');
    formularioCompraSuelta.id = 'formCompraSuelta';
    stock.forEach(producto => {
        const etiquetaCampo = document.createElement('label');
        etiquetaCampo.textContent = producto.nombre;
        contenedor.appendChild(etiquetaCampo);

        const selectorCantidad = document.createElement('input');
        selectorCantidad.type = 'number';
        selectorCantidad.min = 0;
        selectorCantidad.id = `cantidad-${producto.nombre}`;
        selectorCantidad.placeholder = `0`;
        contenedor.appendChild(etiquetaCampo);
    });

    const botonSubmitSuelta = document.createElement('button');
    botonSubmitSuelta.textContent = 'Registrar Compra';
    formularioCompraSuelta.appendChild(botonSubmitSuelta);

    const botonCancelarRegistro = document.createElement('button');
    botonCancelarRegistro.textContent = 'Registrar Compra';
    formularioCompraSuelta.appendChild(botonCancelarRegistro);

    contenedor.appendChild(formularioCompraSuelta);
}

function mostrarFormularioCompraSuelta(){
    
}

//funcion para cambiar el stock, ya sea para agregar en caso de que entre nuevo material o para quitar si se ha registrado una compra
