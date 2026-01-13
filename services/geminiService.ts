import { GoogleGenAI, Type } from "@google/genai";
import { Enemy } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fallback enemies in case API fails
const FALLBACK_ENEMIES: Enemy[] = [
  { name: '流浪忍者', maxHp: 50, currentHp: 50, attack: 5, description: '雾隐村的叛逃者。' },
  { name: '音忍', maxHp: 70, currentHp: 70, attack: 8, description: '大蛇丸的实验体。' },
  { name: '山贼头目', maxHp: 60, currentHp: 60, attack: 6, description: '当地山贼团伙的首领。' },
];

export const generateEnemy = async (playerLevel: number): Promise<Enemy> => {
  try {
    const model = 'gemini-3-flash-preview'; 
    
    // Ensure fresh instance with key if environment changed (though typically static)
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const promptText = `Generate a Naruto-themed enemy for a level ${playerLevel} player. 
      The enemy should be appropriate for this level. 
      Difficulty scales slightly with level.
      Return JSON only.
      Use Chinese (Simplified) for name and description.`;

    const response = await freshAi.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            maxHp: { type: Type.INTEGER },
            attack: { type: Type.INTEGER },
            description: { type: Type.STRING },
          },
          required: ["name", "maxHp", "attack", "description"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        currentHp: data.maxHp,
      };
    }
    throw new Error("No data returned");

  } catch (error) {
    console.error("Gemini generation failed, using fallback", error);
    const fallback = FALLBACK_ENEMIES[Math.floor(Math.random() * FALLBACK_ENEMIES.length)];
    // Scale fallback slightly
    const scale = 1 + (playerLevel * 0.1);
    return {
      ...fallback,
      maxHp: Math.floor(fallback.maxHp * scale),
      currentHp: Math.floor(fallback.maxHp * scale),
      attack: Math.floor(fallback.attack * scale),
    };
  }
};

const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url, { mode: 'cors' });
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // remove prefix
      resolve(result.split(',')[1]); 
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const editImage = async (imageSrc: string, prompt: string): Promise<string> => {
  try {
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 1. Get Base64 data
    let base64Data = '';
    let mimeType = 'image/png';
    
    if (imageSrc.startsWith('data:')) {
      base64Data = imageSrc.split(',')[1];
      mimeType = imageSrc.substring(imageSrc.indexOf(':') + 1, imageSrc.indexOf(';'));
    } else {
      // Fetch from URL
      base64Data = await urlToBase64(imageSrc);
    }

    // 2. Call Gemini
    const response = await freshAi.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          parts: [
            {
               inlineData: {
                 mimeType: mimeType,
                 data: base64Data
               }
            },
            { text: prompt }
          ]
        }
      ]
    });

    // 3. Extract Image
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image editing failed:", error);
    throw error;
  }
};

export const editImageBrowser = editImage;

export const generateVideo = async (imageSrc: string, prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
  try {
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let base64Data = '';
    let mimeType = 'image/png';

    if (imageSrc.startsWith('data:')) {
      base64Data = imageSrc.split(',')[1];
      // Veo expects clean mime types, usually png/jpeg
      const foundMime = imageSrc.substring(imageSrc.indexOf(':') + 1, imageSrc.indexOf(';'));
      if (foundMime === 'image/jpeg' || foundMime === 'image/png') {
        mimeType = foundMime;
      }
    } else {
      base64Data = await urlToBase64(imageSrc);
    }

    let operation = await freshAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Animate this character naturally, subtle breathing and movement",
      image: {
        imageBytes: base64Data,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Veo fast supports 720p or 1080p
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await freshAi.operations.getVideosOperation({ operation: operation });
    }

    if (operation.response?.generatedVideos?.[0]?.video?.uri) {
      const downloadLink = operation.response.generatedVideos[0].video.uri;
      // Fetch with key to get actual bytes
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

    throw new Error("Video generation completed but no URI returned.");
  } catch (error) {
    console.error("Video generation failed:", error);
    throw error;
  }
};