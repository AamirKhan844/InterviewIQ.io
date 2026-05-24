import axios from "axios";
export const askAi = async (messsages) => {
  try {
    if (!messsages || !Array.isArray(messsages) || messsages.length === 0) {
      throw new Error("Messages Array is Empty");
    }
    const response = await axios.post(
      "vhttps://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messsages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type": "application/json",
        },
      },
    );
    const content = response?.data?.choices?.[0].message?.content;
    if (!content || !content.trim()) {
      throw new Error("AI returned Empty Response");
    }
    return content;
  } catch (error) {
    console.error("Openrouter Error", error?.response?.data || error.message);
    throw new Error("OpenRouter APi error ");
  }
};
