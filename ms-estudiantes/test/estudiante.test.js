const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');

describe('Pruebas RESTful - Microservicio Estudiantes', () => {
    let creadoId;

    test('POST /api/estudiantes - Debe registrar un estudiante', async () => {
        const res = await request(app).post('/api/estudiantes').send({
            codigo: 'TEST-999',
            nombres: 'Ana',
            apellidos: 'Torres',
            correo: 'atorres_test@continental.edu.pe',
            carrera: 'Ingeniería Ambiental'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        creadoId = res.body.id;
    });

    test('GET /api/estudiantes - Debe listar estudiantes', async () => {
        const res = await request(app).get('/api/estudiantes');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/estudiantes/:id - Debe consultar el estudiante creado', async () => {
        const res = await request(app).get(`/api/estudiantes/${creadoId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.codigo).toBe('TEST-999');
    });

    test('PUT /api/estudiantes/:id - Debe actualizar el estudiante', async () => {
        const res = await request(app).put(`/api/estudiantes/${creadoId}`).send({
            codigo: 'TEST-999',
            nombres: 'Ana María',
            apellidos: 'Torres',
            correo: 'atorres_test@continental.edu.pe',
            carrera: 'Ingeniería Civil'
        });
        expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/estudiantes/:id - Debe eliminar el estudiante', async () => {
        const res = await request(app).delete(`/api/estudiantes/${creadoId}`);
        expect(res.statusCode).toBe(200);
    });

    afterAll(async () => {
        await pool.end();
    });
});