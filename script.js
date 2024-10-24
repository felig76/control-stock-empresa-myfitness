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
        mostrarOpcionCompraKit(contenedorFormularioCompra);
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
                        cantidad_producto: -input.value
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
                alert('Se ha registrado la compra');
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


function mostrarOpcionCompraKit(contenedorFormularioCompra) {
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
                        cantidad_producto: -cantidad
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
                        alert('Se ha actualizado el stock');
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

    const contenedorFormularios = document.createElement('div');
    contenedorFormularios.id = 'contenedorFormulariosIngresoStock';
    contenedorFormularios.style.display = 'grid';

    const formularioIngresoBarras = document.createElement('div');
    formularioIngresoBarras.innerHTML = `
        <form id="formularioIngresoBarras">
            <label for="cantidad-barras-cortas">Barras cortas (7kg por barra):</label>
            <input type="number" id="cantidad-barras-cortas" name="barras-cortas" min="0">
            <br>
            <label for="cantidad-barras-largas">Barras largas (10kg por barra):</label>
            <input type="number" id="cantidad-barras-largas" name="barras-largas" min="0">
            <br>
            <button type="submit">Agregar al stock</button>
            <p id="error-mensaje" style="color: red; display: none;"></p>
        </form>
    `;

    formularioIngresoBarras.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir la recarga de la página

        // Obtener los datos del formulario
        const barrasCortas = parseInt(document.getElementById('cantidad-barras-cortas').value) || 0;
        const barrasLargas = parseInt(document.getElementById('cantidad-barras-largas').value) || 0;
        const hierroNecesario = (barrasCortas * 7) + (barrasLargas * 10); // Calcular el hierro necesario

        // Fetch para obtener el stock de hierro disponible en tiempo real
        fetch('obtenerStock.php')
            .then(response => response.json())
            .then(data => {
                const hierro = data.find(item => item.nombre_producto === 'Hierro');
                const cantidadHierro = hierro ? hierro.cantidad_producto : 0;

                // Comprobar si hay suficiente hierro disponible
                if (hierroNecesario > cantidadHierro) {
                    alert('No hay hierro suficiente en stock para la producción');
                } else {
                    const datosFormulario = [
                        { nombre_producto: 'Barras cortas', cantidad_producto: barrasCortas },
                        { nombre_producto: 'Barras largas', cantidad_producto: barrasLargas },
                        { nombre_producto: 'Hierro', cantidad_producto: -hierroNecesario }
                    ];

                    fetch('actualizarStock.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(datosFormulario)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al actualizar el stock');
                        }
                        return response.text();
                    })
                    .then(data => {
                        alert('Se ha actualizado el stock');
                    })
                    .catch(error => {
                        console.error('Error al actualizar el stock:', error);
                    });
                }
            })
            .catch(error => {
                console.error('Error al obtener el stock:', error);
            });
    });

    const listaIngresoStock = document.createElement('ul');
    listaIngresoStock.id = 'listaIngresoStock';
    listaIngresoStock.innerHTML = '<h3>Agregar otros elementos al stock</h3>';

    const productos = ['Discos 1kg', 'Discos 2kg', 'Discos 5kg', 'Discos 10kg', 'Mariposas para barra', 'Hierro'];
    
    productos.forEach(producto => {
        const itemProducto = document.createElement('li');
        const etiquetaProducto = document.createElement('label');
        etiquetaProducto.textContent = `Agregar ${producto}`;
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.placeholder = 'Cantidad a ingresar';
        inputCantidad.id = `cantidad-${producto}`;

        itemProducto.appendChild(etiquetaProducto);
        itemProducto.appendChild(inputCantidad);
        listaIngresoStock.appendChild(itemProducto);
    });

    // Botón para enviar el stock actualizado
    const botonAgregarStock = document.createElement('button');
    botonAgregarStock.textContent = 'Agregar al stock';
    botonAgregarStock.addEventListener('click', () => {
        const datosStock = productos.map(producto => {
            const cantidad = document.getElementById(`cantidad-${producto}`).value;
            return {
                nombre_producto: producto,
                cantidad_producto: parseInt(cantidad) || 0
            };
        }).filter(item => item.cantidad_producto > 0); // Filtrar los productos que tienen cantidad válida

        if (datosStock.length > 0) {
            fetch('actualizarStock.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosStock)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta');
                }
                return response.text();
            })
            .then(data => {
                alert('Se ha actualizado el stock');
            })
            .catch(error => {
                console.error('Error al actualizar el stock:', error);
            });
        } else {
            alert('Ingrese al menos una cantidad válida para los productos.');
        }
    });

    listaIngresoStock.appendChild(botonAgregarStock);

    // Agregar los formularios al contenedor principal
    contenedorFormularios.appendChild(formularioIngresoBarras);
    contenedorFormularios.appendChild(listaIngresoStock);

    contenedorPanelOperacion.appendChild(contenedorFormularios);
}