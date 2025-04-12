const amqp = require('amqplib');
const express = require('express');

const app = express();
const port = 3002;

const stats = {
  totalMessages: 0,
  clients: {},
  lastUpdated: null
};

async function start() {
  try {
    const conn = await amqp.connect('amqp://laura:123@rabbitmq');
    const channel = await conn.createChannel();
    
    await channel.assertExchange('analytics_exchange', 'direct', { durable: true });
    await channel.assertQueue('analytics_queue', { durable: true });
    await channel.bindQueue('analytics_queue', 'analytics_exchange', 'analytics');
    
    console.log('Conectado a RabbitMQ');
    
    channel.consume('analytics_queue', (msg) => {
      if (msg) {
        const { clientId } = JSON.parse(msg.content.toString());
        stats.totalMessages++;
        stats.clients[clientId] = (stats.clients[clientId] || 0) + 1;
        stats.lastUpdated = new Date().toISOString();
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error de conexión:', error.message);
    setTimeout(start, 5000); 
  }
}

app.get('/stats', (req, res) => {
  res.json(stats);
});


app.listen(port, () => {
  console.log(`Servicio Analíticas en http://localhost:${port}`);
  start();
});