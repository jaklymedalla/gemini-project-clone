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

  const delayPara = (index, nextWord) => {
    setTimeout(function (){
      setResultData(prev=>prev+nextWord)
    },75*index )
  };

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if(prompt !== undefined){
      response = await runGeminiChat(prompt);
      setRecentPrompt(prompt)
    }
    else{
      setPrevPrompts(prev=>[...prev,input])
      setRecentPrompt(input)
      response = await runGeminiChat(input)
    }
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
    let newResponseArray = newResponse.split(" ");
    for(let i=0; i<newResponseArray.length; i++)
    {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord+" ")
    }
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
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
