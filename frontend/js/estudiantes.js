const API_URL = '/api/estudiantes';
const form = document.getElementById('estudianteForm');
const tabla = document.getElementById('tablaEstudiantes');
const btnCancelar = document.getElementById('btnCancelar');
let siguienteCodigoEst = 'U20261001';

function calcularSiguienteCodigoEstudiante(lista) {
    if (!lista || lista.length === 0) return 'U20261001';
    let maxNum = 20261000;
    lista.forEach(est => {
        const match = String(est.codigo).match(/\d+/);
        if (match) {
            const num = parseInt(match[0], 10);
            if (num > maxNum) maxNum = num;
        }
    });
    return `U${maxNum + 1}`;
}

async function cargarEstudiantes() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        document.getElementById('totalEstudiantes').textContent = `${data.length} registros`;

        siguienteCodigoEst = calcularSiguienteCodigoEstudiante(data);
        if (!document.getElementById('estId').value) {
            document.getElementById('codigo').value = siguienteCodigoEst;
        }

        if (data.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        No hay estudiantes registrados todavía.
                    </td>
                </tr>
            `;
            return;
        }

        tabla.innerHTML = data.map(est => `
            <tr>
                <td class="fw-semibold text-nowrap">${est.codigo}</td>
                <td>${est.nombres} ${est.apellidos}</td>
                <td>${est.correo}</td>
                <td>${est.carrera}</td>
                <td class="text-center text-nowrap">
                    <button type="button" class="btn btn-sm btn-outline-primary me-1" 
                            title="Editar" onclick='editarEstudiante(${JSON.stringify(est)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" 
                            title="Eliminar" onclick="eliminarEstudiante(${est.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('estId').value;
    const payload = {
        codigo: document.getElementById('codigo').value.trim(),
        nombres: document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        carrera: document.getElementById('carrera').value.trim()
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    resetForm();
    cargarEstudiantes();
});

function editarEstudiante(est) {
    document.getElementById('estId').value = est.id;
    document.getElementById('codigo').value = est.codigo;
    document.getElementById('nombres').value = est.nombres;
    document.getElementById('apellidos').value = est.apellidos;
    document.getElementById('correo').value = est.correo;
    document.getElementById('carrera').value = est.carrera;
    document.getElementById('formTitle').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Estudiante';
    document.getElementById('btnGuardar').textContent = 'Actualizar Estudiante';
    btnCancelar.classList.remove('d-none');

    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function eliminarEstudiante(id) {
    if (!confirm('¿Seguro que deseas eliminar este estudiante?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarEstudiantes();
}

function resetForm() {
    form.reset();
    document.getElementById('estId').value = '';
    document.getElementById('codigo').value = siguienteCodigoEst;
    document.getElementById('formTitle').innerHTML = '<i class="bi bi-person-plus-fill me-2"></i>Registrar Estudiante';
    document.getElementById('btnGuardar').textContent = 'Guardar Estudiante';
    btnCancelar.classList.add('d-none');
}

btnCancelar.addEventListener('click', resetForm);
cargarEstudiantes();