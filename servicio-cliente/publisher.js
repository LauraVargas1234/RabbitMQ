const amqp = require('amqplib');
const express = require('express');

class RabbitMQPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchangeName = 'analytics_exchange';
    this.queueName = 'analytics_queue';
    this.routingKey = 'analytics';
    this.rabbitUrl = 'amqp://laura:123@rabbitmq:5672';
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.rabbitUrl);
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });
      await this.channel.assertQueue(this.queueName, { durable: true });
      await this.channel.bindQueue(this.queueName, this.exchangeName, this.routingKey);
      
      console.log('Publisher conectado a RabbitMQ');
      
      this.connection.on('close', () => {
        console.log('Conexión RabbitMQ cerrada');
        this.reconnect();
      });
      
      return true;
    } catch (error) {
      console.error('Error de conexión:', error.message);
      this.reconnect();
      return false;
    }
  }

  async reconnect() {
    console.log('Intentando reconectar en 5 segundos...');
    setTimeout(() => this.connect(), 5000);
  }

  async publish(message) {
    if (!this.channel) {
      throw new Error('No hay conexión con RabbitMQ');
    }

    try {
      const messageString = JSON.stringify({
        ...message,
        timestamp: new Date().toISOString()
      });

      await this.channel.publish(
        this.exchangeName,
        this.routingKey,
        Buffer.from(messageString),
        { persistent: true }
      );

      console.log('Mensaje publicado:', messageString);
      return true;
    } catch (error) {
      console.error('Error al publicar:', error);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}

const app = express();
const port = 3001;
const publisher = new RabbitMQPublisher();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: publisher.channel ? 'ACTIVO' : 'INACTIVO',
    message: 'Servicio Cliente RabbitMQ',
    endpoints: {
      sendData: 'POST /send-data'
    }
  });
});

app.post('/send-data', async (req, res) => {
  try {
    const { clientId, data } = req.body;
    
    if (!clientId || !data) {
      return res.status(400).json({ error: 'Id del cliente y mensaje requeridos' });
    }

    await publisher.publish({ clientId, data });
    res.json({ success: true, message: 'Datos enviados a la cola' });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al enviar datos',
      details: error.message 
    });
  }
});

publisher.connect();

app.listen(port, () => {
  console.log(`Servicio Cliente escuchando en http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  await publisher.close();
  process.exit(0);
});