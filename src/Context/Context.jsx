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

      const onSent = async (prompt) => {

       setResultData("");
       if (loading) return; // Prevent calling if already running
        
        try {
            setLoading(true);
            setShowResult(true);
            setRecentPrompt(input);
            const response = await runGeminiChat(input);
            console.log(response);
            return response;
        } catch (error) {
            console.error("API Error:", error);
            setResultData(response);
        } finally {
            setLoading(false); // Always turn off loading state
            setInput("");
        }
    }; 
     {/* setResultData("");
       setLoading(true);
       setShowResult(true);
       const response = await runGeminiChat(input);
       setResultData(response);
       setLoading(false)
       setInput(""); */}

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
        setInput
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
