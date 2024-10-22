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
    contenedorPanelOperacion.innerHTML = `<h3>Consultar Stock</h3>`;
    
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
        mostrarOpciónCompraKit(contenedorFormularioCompra);
    });
}

function mostrarFormularioCompraSuelta(contenedorFormularioCompra) {
    contenedorFormularioCompra.innerHTML = '';

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

        const listaProductos = document.createElement('ul'); // Crear lista desordenada

        stock.forEach(producto => {
            const elementoLista = document.createElement('li');
            const etiquetaCampo = document.createElement('label');
            etiquetaCampo.textContent = `${producto.nombre_producto} (${producto.cantidad_producto} disponibles)`;
            etiquetaCampo.setAttribute('for', `cantidad-${producto.nombre_producto}`);
            elementoLista.appendChild(etiquetaCampo);

            const selectorCantidad = document.createElement('input');
            selectorCantidad.type = 'number';
            selectorCantidad.min = 0;
            selectorCantidad.max = producto.cantidad_producto;
            selectorCantidad.id = `cantidad-${producto.nombre_producto}`;
            selectorCantidad.placeholder = `0`;
            elementoLista.appendChild(selectorCantidad);

            listaProductos.appendChild(elementoLista);
        });

        formularioCompraSuelta.appendChild(listaProductos); // Agregar la lista al formulario

        const botonSubmitSuelta = document.createElement('button');
        botonSubmitSuelta.type = 'submit';
        botonSubmitSuelta.textContent = 'Registrar Compra';
        formularioCompraSuelta.appendChild(botonSubmitSuelta);

        formularioCompraSuelta.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Formulario enviado');

            // Obtener los datos del formulario
            const datosFormulario = Array.from(formularioCompraSuelta.querySelectorAll('input'))
                .filter(input => input.value)
                .map(input => {
                    return {
                        nombre_producto: input.id.replace('cantidad-', ''),
                        cantidad_producto: input.value
                    };
                });

            // Enviar datos al servidor
            fetch('actualizarStock.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosFormulario)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta');
                }
                return response.text();
            })
            .then(data => {
                location.reload();
            })
            .catch(error => {
                console.error('Error al actualizar el stock:', error);
            });
        });



        contenedorFormularioCompra.appendChild(formularioCompraSuelta);
    })
    .catch(error => {
        console.error('Error al obtener el stock:', error);
    });
}


function mostrarOpciónCompraKit(contenedorFormularioCompra) {
    contenedorFormularioCompra.innerHTML = '';

    const kits = [
        { nombre: 'Kit de Fuerza Básico', productos: { 'Discos 1kg': 2, 'Barras cortas': 1 } },
        { nombre: 'Kit de Fuerza Avanzado', productos: { 'Discos 5kg': 2, 'Discos 10kg': 2, 'Barras largas': 1 } },
        { nombre: 'Kit de Musculación', productos: { 'Discos 2kg': 2, 'Discos 5kg': 2, 'Barras cortas': 1, 'Mariposas para barra': 2 } },
        { nombre: 'Kit Completo de Fuerza', productos: { 'Discos 1kg': 2, 'Discos 2kg': 2, 'Discos 5kg': 2, 'Discos 10kg': 2, 'Barras cortas': 1, 'Barras largas': 1, 'Mariposas para barra': 4 } }
    ];

    fetch('obtenerStock.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta');
        }
        return response.json();
    })
    .then(stock => {
        kits.forEach(kit => {
            const contenedorKit = document.createElement('div');
            contenedorKit.className = 'kit';

            const nombreKit = document.createElement('h3');
            nombreKit.textContent = kit.nombre;
            contenedorKit.appendChild(nombreKit);

            const descripcionKit = document.createElement('p');
            descripcionKit.textContent = 'Contiene: ' + Object.entries(kit.productos)
                .map(([nombre, cantidad]) => `${nombre} (${cantidad})`).join(', ');
            contenedorKit.appendChild(descripcionKit);

            const hayStockSuficiente = Object.entries(kit.productos).every(([nombre, cantidad]) => {
                const producto = stock.find(p => p.nombre_producto === nombre);
                return producto && producto.cantidad_producto >= cantidad;
            });

            if (hayStockSuficiente) {
                contenedorKit.addEventListener('click', () => {
                    const cantidadesActualizadas = Object.entries(kit.productos).map(([nombre, cantidad]) => ({
                        nombre_producto: nombre,
                        cantidad: -cantidad
                    }));

                    // Aquí envías los datos específicos del kit al servidor
                    fetch('actualizarStock.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cantidadesActualizadas)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log('Stock actualizado:', data);
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Error al actualizar el stock:', error);
                    });
                });
            } else {
                contenedorKit.className += ' no-disponible'; // Añadir clase para estilo de no disponible
            }

            contenedorFormularioCompra.appendChild(contenedorKit);
        });
    })
    .catch(error => {
        console.error('Error al obtener el stock:', error);
    });
}

function calcularIngresarMaterial(contenedorPanelOperacion){
    contenedorPanelOperacion.innerHTML = `<h3>Calculo de material e ingreso de stock</h3>`;

}