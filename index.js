const Fastify = require('fastify');
const { G4F } = require("g4f");
const g4f = new G4F();

const app = Fastify();
const port = process.env.PORT || 3000;

const conversationHistories = {};

const models = [
  "gpt-4", "gpt-4-0613", "gpt-4-32k", "gpt-4-0314", "gpt-4-32k-0314",
  "gpt-3.5-turbo", "gpt-3.5-turbo-16k", "gpt-3.5-turbo-0613", "gpt-3.5-turbo-16k-0613", "gpt-3.5-turbo-0301",
  "text-davinci-003", "text-davinci-002", "code-davinci-002", "gpt-3",
  "text-curie-001", "text-babbage-001", "text-ada-001", "davinci", "curie", "babbage", "ada",
  "babbage-002", "davinci-002"
];

/**
 * API Endpoint: /chatbox
 * Query Parameters:
 * - q: The query to be sent to the CHATBOX AI.
 * - uid: A unique identifier for the user.
 * - model: The model to be used.
 * - cai: The custom prompt you want to add example you want to make the ai act like elon musk.
 * 
 * Example: /chatbox?q=hello&uid=3773&model=gpt-4&cai=act%20like%20elon%20musk
 */
app.get('/chatbox', async (req, reply) => {
  const { q: query, uid, model, cai } = req.query;

  if (!query || !uid || !model) {
    return reply.status(400).send("Missing query, user ID, or model.");
  }

  if (!models.includes(model)) {
    return reply.status(400).send("Invalid model. Use /chatbox/models to get a list of available models.");
  }

  // Reset conversation history
  if (['clear', 'reset', 'forgot', 'forget'].includes(query.toLowerCase())) {
    conversationHistories[uid] = [];
    return reply.send({ answer: "Conversation history cleared." });
  }

  conversationHistories[uid] = conversationHistories[uid] || [];
  conversationHistories[uid].push({ role: "user", content: query });

  const maxRetries = 3;
  let attempts = 0;
  let success = false;
  let answer = '';

  const options = {
    model,
    debug: true,
    retry: {
      times: maxRetries,
      condition: (text) => text.split(" ").length > 10
    },
    output: (text) => text
  };

  while (attempts < maxRetries && !success) {
    try {
      attempts++;
      const response = await g4f.chatCompletion([
        { role: "user", content: cai || "You're a helpful assistant who always helps people answer any questions and talks in a more human tone. Keep your response concise and human-like." },
        ...conversationHistories[uid],
        { role: "user", content: query }
      ], options);

      answer = response.trim();
      success = true;
    } catch (error) {
      if (attempts >= maxRetries) {
        return reply.status(500).send(`No response from CHATBOX AI. Please try again later: ${error.message}`);
      }
    }
  }

  if (success) {
    conversationHistories[uid].push({ role: "assistant", content: answer });

    const responseObject = {
      answer,
      author: "Kenneth Panio"
    };

    reply.send(responseObject);
  }
});

/**
 * API Endpoint: /chatbox/models
 * Provides a list of available models.
 */
app.get('/chatbox/models', (req, reply) => {
  reply.send(models);
});

app.get('/', (req, reply) => {
  reply.send({ message: "API IS RUNNING!" });
});

/**
 * Start the Fastify server.
 */
app.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`API server running at ${address}`);
});