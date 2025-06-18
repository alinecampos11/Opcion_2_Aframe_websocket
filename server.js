const http = require('http');
const WebSocket = require('ws');
const mqtt = require('mqtt');

const PORT = process.env.PORT || 3000;

// Servidor HTTP básico para Render
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Servidor WebSocket conectado');
});

// WebSocket Server enlazado al servidor HTTP
const wss = new WebSocket.Server({ server });

// Enviar datos a todos los clientes conectados
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Conexión al broker MQTT
const mqttClient = mqtt.connect('mqtt://localhost:1883');
mqttClient.on('connect', () => {
  console.log('🔌 Conectado a Mosquitto');
  mqttClient.subscribe('aline/#');
});

mqttClient.on('message', (topic, payload) => {
  const msg = { topic, value: payload.toString(), time: new Date().toISOString() };
  console.log('📡', msg);
  broadcast(msg);
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`🟢 Servidor WebSocket en puerto ${PORT}`);
});
