import LlmConnectorAbstract from "./LlmConnectorAbstract";
import { Chat } from "./types";
import OpenAI from 'openai';
import { Stream } from "openai/streaming";
import { ChatCompletion, ChatCompletionChunk } from "openai/resources";

export default class OpenAIConnector extends LlmConnectorAbstract {
    public static testUrl = "https://api.openai.com/v1/models";

    private static openAI : OpenAI;
    private static model: string;

    constructor() { 
        super();

        if (!OpenAIConnector.openAI) {
            OpenAIConnector.openAI = new OpenAI({
                apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
              });

            OpenAIConnector.model = process.env["LLM_MODEL_NAME"] || "gpt-4";
              
        }
    }

    public async connect(url?: string | undefined, apiKey?: string | undefined): Promise<boolean> {
        try {
            const modelExist = await OpenAIConnector.openAI.models.retrieve(OpenAIConnector.model);
            console.log(modelExist);
            return Promise.resolve(true);
        } catch(e: any) {
            console.error(e.message);
            return Promise.resolve(false);
        }
    }

    public async getChatCompletion(chat: Chat): Promise<ChatCompletion> {

        const completion = await OpenAIConnector.openAI.chat.completions.create({
            model: OpenAIConnector.model, 
            stream: false,
            messages: chat.messages,
            max_tokens: chat.maxTokens ? chat.maxTokens : 300,
        })

        return Promise.resolve(completion);
    }

    public async getChatCompletionStream(chat: Chat): Promise<Stream<ChatCompletionChunk>> {

        const completion = await OpenAIConnector.openAI.chat.completions.create({
            model: OpenAIConnector.model, 
            stream: true,
            messages: chat.messages,
            max_tokens: chat.maxTokens ? chat.maxTokens : 300,
        })

        return Promise.resolve(completion);
    }

    public createCapture(img: BinaryData, prompt: string): Chat {

        let capture: Chat = {messages: []}
        
        return capture;
    }
}