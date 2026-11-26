const express = require('express');
const cors = require('cors');
const estudianteRoutes = require('./routes/estudianteRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/estudiantes', estudianteRoutes);

const PORT = process.env.PORT || 3001;
if (require.main === module) {
    app.listen(PORT, () => console.log(`Microservicio Estudiantes corriendo en puerto ${PORT}`));
}

module.exports = app;