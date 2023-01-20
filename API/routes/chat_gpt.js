const express = require('express')
const router = express.Router()
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");

router.post('', async (req, res) => {
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

        final_response = final_response.replace(/\n/g, '');

        console.log(final_response)
        res.status(200).json( final_response.trim() )
    }
    catch (err) {
        res.status(500).json(err.message)
        console.log(err)
    }
})


module.exports = router