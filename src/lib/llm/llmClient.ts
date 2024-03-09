import { CaptureImage, CaptureType } from "./types";

export async function sendCaptureStream(image: CaptureImage, callback: (text: string) => void) {
    try {
      const response = await fetch('/api/llm/capture', {
        method: 'POST',
        body: JSON.stringify({
            image: image,
            lang: "spanish",
            stream: true,
          }), // Customize messages as needed
      });
      console.log("get body")
      if (!response.body) return;
      console.log("reading start")

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let text = ""
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value);
        text += chunk
        // Handle each chunk of streamed data (e.g., display in UI)
        // console.log(chunk);
        callback(text);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

export async function sendCapture(image: CaptureImage, lang: string, type: CaptureType) : Promise<string> {
  try {
    const response = await fetch('/api/llm/capture', {
      method: 'POST',
      body: JSON.stringify({
          image: image,
          lang: lang,
          type: type,
          stream: false,
        }), // Customize messages as needed
    });
    const res = await response.json()
    console.log(res);
    return res.content || "Error retrieving the response. Try again.";
  } catch(e: any) {
    console.log(e);
    return  "Error retrieving the response. Try again."
  }
}
