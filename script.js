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
        const response = await fetch('obtenerStock.php');
        const stock = await response.json(); // Convertir la respuesta a formato JSON

        // Verifica si el stock tiene datos
        if (stock.length === 0) {
            contenedorPanelOperacion.innerHTML += `<p>No hay productos en stock.</p>`;
            return;
        }

        // Recorrer los productos obtenidos y agregarlos al contenedor
        stock.forEach(producto => {
            let itemProductoStock = document.createElement('li');
            itemProductoStock.textContent = `${producto.nombre_producto}: ${producto.cantidad_producto} en stock`;
            contenedorPanelOperacion.appendChild(itemProductoStock);
        });
    } catch (error) {
        console.error('Error al obtener el stock:', error);
        contenedorPanelOperacion.innerHTML = `<p>Error al obtener el stock.</p>`;
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

    const contenedorFormularioCompra = document.createElement('div');
    contenedorFormularioCompra.id = 'contenedorFormularioCompra'; // Cambiar ID para evitar conflictos

    contenedorPanelOperacion.appendChild(botonCompraSuelta);
    contenedorPanelOperacion.appendChild(botonCompraKit);
    contenedorPanelOperacion.appendChild(contenedorFormularioCompra);

    botonCompraSuelta.addEventListener('click', () => {
        console.log("Botón Compra Suelta clickeado");
        mostrarFormularioCompraSuelta(contenedorFormularioCompra);
    });    
    botonCompraKit.addEventListener('click', () => {
        console.log("Botón Compra Kit clickeado");
        mostrarFormularioCompraKit(contenedorFormularioCompra);
    });
}

function mostrarFormularioCompraSuelta(contenedorFormularioCompra) {
    contenedorFormularioCompra.innerHTML = ''; // Limpiar el contenedor antes de agregar el formulario

    const formularioCompraSuelta = document.createElement('form');
    formularioCompraSuelta.innerHTML = `<h3>Registrar Compra Suelta</h3>`;
    formularioCompraSuelta.id = 'formCompraSuelta';

    fetch('obtenerStock.php')
    .then(response => {
        console.log('Respuesta recibida:', response); // Agregado
        if (!response.ok) {
            throw new Error('Error en la respuesta');
        }
        return response.json();
    })

        .then(stock => {
            console.log("Stock obtenido:", stock); // Verifica si se obtienen datos
            stock.forEach(producto => {
                const etiquetaCampo = document.createElement('label');
                etiquetaCampo.textContent = `${producto.nombre_producto} (${producto.cantidad_producto} disponibles)`;
                etiquetaCampo.setAttribute('for', `cantidad-${producto.nombre_producto}`);
                formularioCompraSuelta.appendChild(etiquetaCampo);

                const selectorCantidad = document.createElement('input');
                selectorCantidad.type = 'number';
                selectorCantidad.min = 0;
                selectorCantidad.max = producto.cantidad_producto;
                selectorCantidad.id = `cantidad-${producto.nombre_producto}`; // Cambiar ID
                selectorCantidad.placeholder = `0`;
                formularioCompraSuelta.appendChild(selectorCantidad);
            });

            // Botón para enviar el formulario
            const botonSubmitSuelta = document.createElement('button');
            botonSubmitSuelta.type = 'submit';
            botonSubmitSuelta.textContent = 'Registrar Compra';
            formularioCompraSuelta.appendChild(botonSubmitSuelta);

            formularioCompraSuelta.addEventListener('submit', (event) => {
                event.preventDefault();
                console.log('Formulario enviado');
                // Aquí puedes manejar el envío del formulario
            });

            contenedorFormularioCompra.appendChild(formularioCompraSuelta);
        })
        .catch(error => {
            console.error('Error al obtener el stock:', error);
        });
}



function mostrarFormularioCompraSuelta(contenedorFormulario){
    
}

//funcion para cambiar el stock, ya sea para agregar en caso de que entre nuevo material o para quitar si se ha registrado una compra
