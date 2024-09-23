let stock = [
    { "nombre": "Discos 1kg", "cantidad": 300 },
    { "nombre": "Discos 2kg", "cantidad": 250 },
    { "nombre": "Discos 5kg", "cantidad": 150 },
    { "nombre": "Discos 10kg", "cantidad": 100 },
    { "nombre": "Barras cortas", "cantidad": 50 },
    { "nombre": "Barras largas", "cantidad": 40 },
    { "nombre": "Mariposas para barra", "cantidad": 200 }
]

document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.opcionOperacion');

    botones.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            mostrarNuevoContenedorOperacion(evento.target, document.getElementById('panelOperacion'));
        });
    });
});

function mostrarNuevoContenedorOperacion(botonOrigen, contenedorPanelOperacion){
    contenedorPanelOperacion.innerHTML = '';
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
function mostrarStock(contenedor) {
    contenedor.innerHTML = `<h3>Consultar Stock</h3>`;
    stock.forEach(producto => {
        itemProductoStock = document.createElement('li')
        itemProductoStock.textContent = `${producto.nombre}: ${producto.cantidad} en stock`;
        contenedor.appendChild(itemProductoStock);
    })
}

// Función para registrar una nueva compra
function registrarCompra(contenedor) {
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

function mostrarFormularioCompraSuelta(contenedor){
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

function mostrarFormularioCompraSuelta(contenedor){
    
}

// Función para calcular e ingresar nuevo material
function calcularIngresarMaterial(contenedor) {
    contenedor.innerHTML = `
        <h3>Ingresar Material</h3>
        <form>
            <label for="material">Material:</label>
            <input type="text" id="material">
            <label for="cantidad">Cantidad:</label>
            <input type="number" id="cantidad">
            <button type="submit">Ingresar Material</button>
        </form>
    `;
}

//funcion para cambiar el stock, ya sea para agregar en caso de que entre nuevo material o para quitar si se ha registrado una compra
