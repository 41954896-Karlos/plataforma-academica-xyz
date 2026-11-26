const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');

describe('Pruebas RESTful - Microservicio Cursos', () => {
    let creadoId;

    test('POST /api/cursos - Debe registrar un curso', async () => {
        const res = await request(app).post('/api/cursos').send({
            codigo: 'CUR-999',
            nombre: 'Arquitectura Cloud',
            creditos: 4,
            docente: 'Mg. Luis Gómez'
        });
        expect(res.statusCode).toBe(201);
        creadoId = res.body.id;
    });

    test('GET /api/cursos - Debe listar cursos', async () => {
        const res = await request(app).get('/api/cursos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('PUT /api/cursos/:id - Debe actualizar el curso', async () => {
        const res = await request(app).put(`/api/cursos/${creadoId}`).send({
            codigo: 'CUR-999',
            nombre: 'Arquitectura Microservicios',
            creditos: 5,
            docente: 'Mg. Luis Gómez'
        });
        expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/cursos/:id - Debe eliminar el curso', async () => {
        const res = await request(app).delete(`/api/cursos/${creadoId}`);
        expect(res.statusCode).toBe(200);
    });

    afterAll(async () => {
        await pool.end();
    });
});