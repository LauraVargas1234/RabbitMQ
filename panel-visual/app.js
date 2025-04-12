const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Endpoint para la vista principal
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://servicio-analiticas:3002/stats');
    res.render('index', {
      title: 'Panel de Monitoreo en Tiempo Real',
      stats: response.data,
      clients: Object.entries(response.data.clients || {})
    });
  } catch (error) {
    console.error('Error:', error);
    res.render('index', {
      title: 'Panel de Monitoreo',
      stats: { totalMessages: 0, clients: {}, lastUpdated: null },
      clients: []
    });
  }
});

// Nuevo endpoint para actualización AJAX
app.get('/stats', async (req, res) => {
  try {
    const response = await axios.get('http://servicio-analiticas:3002/stats');
    res.json(response.data);
  } catch (error) {
    res.json({ 
      totalMessages: 0,
      clients: {},
      lastUpdated: null,
      error: "No se pudieron cargar los datos"
    });
  }
});

app.listen(3000, () => {
  console.log('Panel Visual con auto-actualización en http://localhost:3000');
});