const fs = require('fs');
let nodeFetch;
import('node-fetch')
  .then((module) => {
    nodeFetch = module.default;
    // Use nodeFetch here
    // ...
  })
  .catch((error) => {
    console.error('Error loading node-fetch:', error);
  });

const crypto = require('crypto')
const express = require('express');
const cors = require('cors');
const app = express();
const { Configuration, OpenAIApi } = require('openai');

const apiKey = "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"
const URL = "https://api.openai.com/v1/images/generations";

app.use(cors());
app.use(express.json());

app.use(express.static('cliente'));
app.use('/images', express.static(__dirname + 'cliente/images'))

app.get('/', (req, res) => {
    res.sendFile('/home/jose/repos/betostylenodejs/src/cliente/' + '/index.html');
  });

app.post('/generar-imagen', async (req, res) => {
  const prompt = req.body.prompt;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`
  };

  try {
    if (!!!prompt) {
      throw Error('No prompt found');
    }

    const response = await fetch(URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({prompt, size: '256x256'}),
    });

    const data = await response.json();
    console.log({data});

    const imageUrl = data.data[0].url;

    const imageResponse = await fetch(imageUrl);
    const imageBUffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBUffer);

    const id = crypto.randomBytes(20).toString('hex');
    const filename = `${id}.jpg`;
    const pathname = 'cliente/images/';

    fs.writeFileSync(`${pathname}${filename}`, buffer);
    console.log('Imagen Guardada')

    res.setHeader('Content-Type', 'application/json');
    res.json({filename});

  } catch (error) {
    console.error('Error generating image', error.message);
    res.sendStatus(500);
  }
})

app.listen(3000, () => console.log('El servidor se esta ejecutando en el port 3000'))