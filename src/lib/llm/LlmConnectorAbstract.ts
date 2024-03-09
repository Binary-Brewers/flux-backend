import { ChatCompletion, ChatCompletionChunk } from "openai/resources";
import { Chat } from "./types";
import { Stream } from "openai/streaming";

export default abstract class LlmConnectorAbstract {
    public abstract connect(url?: string, apiKey?: string): Promise<boolean>;

    public abstract getChatCompletion(chat: Chat): Promise<ChatCompletion>;

    public abstract getChatCompletionStream(chat: Chat): Promise<Stream<ChatCompletionChunk>>;

    public abstract createCapture(img: BinaryData, prompt: string): Chat;
}