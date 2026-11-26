const express = require('express');
const cors = require('cors');
const estudianteRoutes = require('./routes/estudianteRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/estudiantes', estudianteRoutes);

const PORT = 3001;
if (require.main === module) {
    app.listen(PORT, () => console.log(`Microservicio Estudiantes corriendo en http://localhost:${PORT}`));
}

module.exports = app; // Exportado para Supertest