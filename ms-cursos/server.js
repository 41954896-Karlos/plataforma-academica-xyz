const express = require('express');
const cors = require('cors');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cursos', cursoRoutes);

const PORT = 3002;
if (require.main === module) {
    app.listen(PORT, () => console.log(`Microservicio Cursos corriendo en http://localhost:${PORT}`));
}

module.exports = app;