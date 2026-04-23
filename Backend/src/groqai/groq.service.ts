import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const getGroqAdvice = async (question: string) => {
  // Use the current working model
  const model = "llama-3.3-70b-versatile";
  
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: model,
        messages: [
          {
            role: "system",
            content: `You are a maternal health assistant. Keep responses:
1. SHORT and CONCISE (3-4 sentences max)
2. Clear and easy to read
3. No markdown formatting (no **bold**, no lists, no \n)
4. Just plain text in paragraphs
5. Focus on key information only
6. Always end with "Consult your doctor for personalized advice.
7. Only answers questions within Maternal Care context alone,if asked any other field say you are a maternal care assistant only"`
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 200  // Shorter response
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    // Clean up the response - remove markdown and fix formatting
    let answer = response.data.choices[0]?.message?.content || "No response";
    
    // Remove markdown formatting
    answer = answer.replace(/\*\*/g, '');
    answer = answer.replace(/\n/g, ' ');
    answer = answer.replace(/\s+/g, ' ').trim();
    
    return answer;
    
  } catch (error: any) {
    console.error("Groq error:", error.response?.data || error.message);
    throw new Error("AI service error");
  }
};