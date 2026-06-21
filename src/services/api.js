import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI. We must use dangerouslyAllowBrowser because we are calling it directly from React.
// For a hackathon demo, this is acceptable.
const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true 
});

export const analyzeCodeFootprint = async (code, language = "Python", optimization = "Aggressive") => {
  try {
    const prompt = `
      You are EcoSphere, an AI assistant hooked into an AWS Green Coding Vector DB.
      Your job is to analyze the following ${language} code for computational efficiency and carbon hotspots.
      The user requested an optimization level of: ${optimization}.

      Rewrite the code to be greener (e.g. vectorization, removing redundant loops, efficient data structures).
      
      Respond EXACTLY in this JSON format, no markdown wrapping, no extra text:
      {
        "optimizedCode": "string of the rewritten code",
        "message": "A brief 1-sentence insight about what you changed and why it saves carbon.",
        "metrics": {
          "co2Saved": "e.g. 15g",
          "cpuCyclesSaved": "e.g. 45%",
          "timeSaved": "e.g. 120ms"
        }
      }

      CODE TO ANALYZE:
      ${code}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = response.choices[0].message.content;
    
    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("LLM failed to return a valid JSON object.");
    }
  } catch (err) {
    console.error("OpenAI API Error:", err);
    throw new Error(err.message || "Failed to analyze code with OpenAI.");
  }
};

export const analyzeApplianceImage = async (base64Image, mimeType) => {
  try {
    const prompt = `
      Analyze this image of an appliance or electronic device.
      Identify what it is, its likely energy profile, and provide a localized Indian "Jugaad" (frugal hack) to reduce its energy consumption.
      
      Respond EXACTLY in this JSON format, no markdown wrapping:
      {
        "appliance": "Name of the appliance (e.g., Non-Inverter AC, Old Refrigerator)",
        "confidence": "e.g. 98%",
        "insight": "Brief insight on why this consumes a lot of power.",
        "jugaad": "A practical, clever hack to save energy using this device.",
        "action": "A suggested automated action (e.g., Schedule Smart Plug)"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Must use gpt-4o or gpt-4-turbo for vision
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const text = response.choices[0].message.content;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("LLM failed to return a valid JSON object.");
    }
  } catch (err) {
    console.error("OpenAI VLM Error:", err);
    throw new Error(err.message || "Failed to analyze image.");
  }
};

export const fetchGridForecast = async () => {
  await new Promise(r => setTimeout(r, 1000));
  
  const hour = new Date().getHours();
  let solar = 0; let wind = 15; let coal = 85;
  let message = ""; let bestTime = "14:00"; 

  if (hour >= 10 && hour <= 16) {
    solar = 65; coal = 20;
    message = "Peak solar hours detected. Grid carbon intensity is extremely low. Run appliances now.";
    bestTime = "Now";
  } else if (hour > 16 && hour <= 21) {
    solar = 5; coal = 80;
    message = "Evening peak load. The grid is relying heavily on coal. Delay appliances if possible.";
    bestTime = "23:00";
  } else {
    solar = 0; wind = 25; coal = 75;
    message = "Low overall grid demand, but zero solar. Wind power is contributing 25%.";
    bestTime = "13:00"; 
  }

  return {
    currentIntensity: coal > 50 ? 'High' : 'Low',
    solarPercentage: solar,
    windPercentage: wind,
    coalPercentage: coal,
    bestTime: bestTime,
    message: message
  };
};
