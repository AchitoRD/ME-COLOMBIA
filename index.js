// index.js
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Creamos el cliente de Discord. Asegúrate de incluir los intents necesarios.
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log(`Bot conectado como ${client.user.tag} (ID: ${client.user.id})`);
});

// Endpoint para recibir la consulta y enviar el comando al canal
app.post('/consultar', async (req, res) => {
  const { placa } = req.body;
  if (!placa) {
    return res.status(400).json({ error: 'Se requiere la placa.' });
  }
  const channelId = "609151596408078341"; // Canal en el que se enviará el mensaje
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Canal no encontrado" });
    }
    // Construimos el comando como si fuera escrito por un usuario.
    const command = `/consultar-placa ${placa}`;
    const message = await channel.send(command);
    console.log(`Comando enviado: ${command} (Mensaje ID: ${message.id})`);
    return res.status(200).json({ success: true, message: command, messageId: message.id });
  } catch (error) {
    console.error("Error al enviar el comando:", error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
