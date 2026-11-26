const API_CURSOS = '/api/cursos';
const cursoForm = document.getElementById('cursoForm');
const tablaCursos = document.getElementById('tablaCursos');
const btnCancelarCurso = document.getElementById('btnCancelarCurso');
let siguienteCodigoCurso = 'ISW-301';

function calcularSiguienteCodigoCurso(lista) {
    if (!lista || lista.length === 0) return 'ISW-301';
    let maxNum = 300;
    lista.forEach(c => {
        const match = String(c.codigo).match(/\d+/);
        if (match) {
            const num = parseInt(match[0], 10);
            if (num > maxNum) maxNum = num;
        }
    });
    return `ISW-${maxNum + 1}`;
}

async function cargarCursos() {
    try {
        const res = await fetch(API_CURSOS);
        const data = await res.json();
        document.getElementById('totalCursos').textContent = `${data.length} registros`;

        siguienteCodigoCurso = calcularSiguienteCodigoCurso(data);
        if (!document.getElementById('cursoId').value) {
            document.getElementById('codigoCurso').value = siguienteCodigoCurso;
        }

        if (data.length === 0) {
            tablaCursos.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        No hay cursos registrados todavía.
                    </td>
                </tr>
            `;
            return;
        }

        tablaCursos.innerHTML = data.map(c => `
            <tr>
                <td class="fw-semibold text-nowrap">${c.codigo}</td>
                <td>${c.nombre}</td>
                <td class="text-center">${c.creditos}</td>
                <td>${c.docente}</td>
                <td class="text-center text-nowrap">
                    <button type="button" class="btn btn-sm btn-outline-primary me-1" 
                            title="Editar" onclick='editarCurso(${JSON.stringify(c)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" 
                            title="Eliminar" onclick="eliminarCurso(${c.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar cursos:', error);
    }
}

cursoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cursoId').value;
    const payload = {
        codigo: document.getElementById('codigoCurso').value.trim(),
        nombre: document.getElementById('nombreCurso').value.trim(),
        creditos: parseInt(document.getElementById('creditosCurso').value, 10),
        docente: document.getElementById('docenteCurso').value.trim()
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_CURSOS}/${id}` : API_CURSOS;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    resetCursoForm();
    cargarCursos();
});

function editarCurso(c) {
    document.getElementById('cursoId').value = c.id;
    document.getElementById('codigoCurso').value = c.codigo;
    document.getElementById('nombreCurso').value = c.nombre;
    document.getElementById('creditosCurso').value = c.creditos;
    document.getElementById('docenteCurso').value = c.docente;
    document.getElementById('formCursoTitle').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Curso';
    document.getElementById('btnGuardarCurso').textContent = 'Actualizar Curso';
    btnCancelarCurso.classList.remove('d-none');

    cursoForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function eliminarCurso(id) {
    if (!confirm('¿Seguro que deseas eliminar este curso?')) return;
    await fetch(`${API_CURSOS}/${id}`, { method: 'DELETE' });
    cargarCursos();
}

function resetCursoForm() {
    cursoForm.reset();
    document.getElementById('cursoId').value = '';
    document.getElementById('codigoCurso').value = siguienteCodigoCurso;
    document.getElementById('formCursoTitle').innerHTML = '<i class="bi bi-journal-plus me-2"></i>Registrar Curso';
    document.getElementById('btnGuardarCurso').textContent = 'Guardar Curso';
    btnCancelarCurso.classList.add('d-none');
}

btnCancelarCurso.addEventListener('click', resetCursoForm);
cargarCursos();