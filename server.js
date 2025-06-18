// BACKEND Node.js: MQTT → WebSocket
const mqtt = require('mqtt');
const WebSocket = require('ws');
const http = require('http');

// Conexión a Mosquitto local
const mqttClient = mqtt.connect('mqtt://localhost:1883');

// Crear servidor HTTP básico (Render requiere uno)
const PORT = process.env.PORT || 3000;
const server = http.createServer(...);
server.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

// Enviar a todos los clientes conectados
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Conexión MQTT y suscripción
mqttClient.on('connect', () => {
  console.log('🔌 Conectado a Mosquitto');
  mqttClient.subscribe('aline/#');
});

mqttClient.on('message', (topic, payload) => {
  const msg = { topic, value: payload.toString(), time: new Date().toISOString() };
  console.log('📡', msg);
  broadcast(msg);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🟢 Servidor WebSocket en puerto ${PORT}`);
});
