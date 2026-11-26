const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

const MS_ESTUDIANTES_URL = process.env.MS_ESTUDIANTES_URL || 'http://localhost:3001';
const MS_CURSOS_URL = process.env.MS_CURSOS_URL || 'http://localhost:3002';

app.use('/api/estudiantes', createProxyMiddleware({
    target: MS_ESTUDIANTES_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/estudiantes${path}`
}));

app.use('/api/cursos', createProxyMiddleware({
    target: MS_CURSOS_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/cursos${path}`
}));

app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/estudiantes.html'));
});

app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway y Frontend activos en puerto ${PORT}`);
});