import { Response, Request } from "express";
import express from "express";

import OpenAIConnector from "../lib/llm/OpenAIConnector";
import { CaptureImage, CaptureType, Chat } from "../lib/llm/types";

const router = express.Router();
const openAI = new OpenAIConnector();

// Home page route.
router.get("/capture", async function (req: Request, res: Response) {
    try {
        const body = req.body;
        const image = body.image as CaptureImage;
        const lang = body.lang;
        const isStream = body.stream || false;
        const captureType : CaptureType = body.type || "objects";
    
        console.log(image);
        if(!image || !image.data || !image.mime || !lang) return res.status(422).json({error: "Missing image."});
    
        const prompt = captureType == "objects" ? 
        "From the following picture, analize every distinct object on it. Return ONLY a json object of the format `{vocab: [{name: 'string', translation: 'string'}]}` with translations into " + lang :
        captureType == "story" ?
        `From the following picture, create a fun one-to-two sentence story in ${lang}. Then, give an english explanation on how the systax works and the vocabulary used.` :
        `From the following picture, briefly describe it in ${lang} and give an english explanation on the vocabulary and syntax used.`; // description
    
        const completionOptions: Chat = {
          maxTokens: captureType == "objects" ? 300 : 600,
          messages: [
            {
              role: "system",
              content: captureType == "objects" ? "You are a helpful language assistant that responds with JSON objects." :
                                      `You are a helpful language assistant to learn ${lang} syntax and vocabulary for english speakers.`
            },
            {
              role: "user",
              content: [
                {
                  type: "text", 
                  text: prompt
                },
                {
                  type: "image_url",
                   image_url: {
                    url: `data:${image.mime};base64,${image.data}`
                   }
                }
              ],
            },
          ]
        }
    
        if (!isStream) {
          const completion = await openAI.getChatCompletion(completionOptions)
    
          return res.status(200).json({
              message: "Ok",
              content: completion.choices[0]?.message.content,
            });
        }
    
    
        const completionStream = await openAI.getChatCompletionStream(completionOptions);

        for await (const chunk of completionStream) {
            res.write(chunk.choices[0]?.delta?.content || '');
        }
        
    
        return res.end();
    
      } catch(e: any) {
        console.log(e);
        return res.status(500).json({
            error: e.message,
        }) 
    }
});

export default { path: "/api/openai", router: router };