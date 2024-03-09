// export interface Message {
//     role: string,
//     type: "text" | "image_url",
//     content?: string,
//     image_url?: {
//         url: string
//     },
// }

import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";


export type Chat = {
    // model: string,
    messages: Array<ChatCompletionMessageParam>,
    maxTokens?: number,
}

export type CaptureImage = {
    mime: string,
    data: string,
}

export type CaptureType = "objects" | "description" | "story";

export type Vocabulaty = {
    name: string,
    translation: string,
}