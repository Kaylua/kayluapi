const express = require('express');
const app = express();

// Configure DotENV
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

// Middleware to parse body to JSON for all JSON requests
app.use(express.json())

// endpoint for '/'
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});



app.post('/chatgpt', async (req, res) => {
  try {
    const configuration = new Configuration({
      apiKey: "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",
    });
    
    async function getAiResponse(topic) {
      const openai = new OpenAIApi(configuration);
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: topic,
        max_tokens: 1024,
        n: 1,
        stop: null,
        temperature: 0.7
      });

      return completion.data.choices[0].text;
    }
    const response = await getAiResponse(req.body.prompt);
    var final_response = response

    //final_response = final_response.replace(/\n/g, '');

    console.log(final_response)
    res.status(200).json( final_response.trim() )
}
catch (err) {
    res.status(500).json(err.message)
    console.log(err)
}
});




// start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// You can create as many endpoints as you want by using the app.get() method and specifying a different path for each endpoint. The req.params object is used to access any parameters passed in the URL.

// You can also use app.post() for post request, app.put() for update and app.delete() for delete request.

app.use('/chat_gpt', require('./routes/chat_gpt'))
