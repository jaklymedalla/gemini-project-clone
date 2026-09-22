import { createContext, useState } from "react";
import runGeminiChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {};

  const onSent = async (prompt) => {
    {
      /* if (loading) return; // Prevent multiple clicks/submits
    
    // Clear previous data and set up layout flags
    setResultData("");
    setLoading(true);
    setShowResult(true);

    // Use the passed prompt parameter if it exists (e.g., from a sidebar click), 
    // otherwise fallback to the active text input box state
    const currentPrompt = prompt !== undefined ? prompt : input;
    setRecentPrompt(currentPrompt);

    try {
        const response = await runGeminiChat(currentPrompt);
        console.log("Gemini API Response:", response);
        
        // FIX: You must save the response to state so React renders it!
        setResultData(response); 
    } catch (error) {
        console.error("API Error:", error);
        setResultData("An error occurred while fetching the response. Please try again.");
    } finally {
        setLoading(false); // Always turn off loading layout
        setInput("");      // Clear the input box text
    } */
    }

    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    const response = await runGeminiChat(input);
    let newResponse = response;

    // 1. Convert code blocks
    newResponse = newResponse.replace(
      /```(?:jsx|javascript|js)?\s*([\s\S]*?)```/g,
      "<pre><code>$1</code></pre>",
    );

    // 2. Convert horizontal rules
    newResponse = newResponse.replace(/^---$/gm, "<hr>");

    // 3. Convert ### headers
    newResponse = newResponse.replace(/^###\s+(.*)$/gm, "<h3>$1</h3>");

    // 4. Convert **bold**
    newResponse = newResponse.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // 5. Convert *italic*
    newResponse = newResponse.replace(
      /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
      "<i>$1</i>",
    );

    // 6. Convert bullet points
    newResponse = newResponse.replace(/^\s*[-*]\s+(.*)$/gm, "• $1<br>");

    // 7. Convert numbered lists
    newResponse = newResponse.replace(/^\s*(\d+)\.\s+(.*)$/gm, "$1. $2<br>");

    // 8. Convert remaining newlines
    newResponse = newResponse.replace(/\n/g, "<br>");

    // IMPORTANT: save the processed response
    setResultData(newResponse);
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    onSent,
    loading,
    prevPrompts,
    setPrevPrompts,
    recentPrompt,
    setRecentPrompt,
    showResult,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
