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
            mostrarNuevoContenedorOperacion(evento.target, document.getElementById('panelParaRealizarOperacion'));
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
    contenedor.innerHTML = ``;

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

    // Crear y añadir el formulario para la compra suelta
    const formularioSuelta = document.createElement('form');
    formularioSuelta.id = 'formSuelta';
    formularioSuelta.innerHTML = `
        <h3>Registrar Compra Suelta</h3>
        <label for="productoSuelto">Producto:</label>
        <input type="text" id="productoSuelto">
        <label for="cantidadSuelta">Cantidad:</label>
        <input type="number" id="cantidadSuelta">
        <button type="submit">Registrar Compra Suelta</button>
    `;
    formularioSuelta.style.display = 'none'; // Ocultar inicialmente

    // Crear y añadir el formulario para el kit
    const formularioKit = document.createElement('form');
    formularioKit.id = 'formKit';
    formularioKit.innerHTML = `
        <h3>Registrar Kit o Familia de Equipamiento</h3>
        <label for="kit">Kit:</label>
        <input type="text" id="kit">
        <label for="cantidadKit">Cantidad:</label>
        <input type="number" id="cantidadKit">
        <button type="submit">Registrar Kit</button>
    `;
    formularioKit.style.display = 'none'; // Ocultar inicialmente

    // Añadir formularios al contenedor
    contenedor.appendChild(formularioSuelta);
    contenedor.appendChild(formularioKit);

    // Añadir eventos a los botones
    botonSuelta.addEventListener('click', () => {
        formularioSuelta.style.display = 'block';
        formularioKit.style.display = 'none';
    });

    botonKit.addEventListener('click', () => {
        formularioKit.style.display = 'block';
        formularioSuelta.style.display = 'none';
    });
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