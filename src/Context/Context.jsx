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
    {/* if (loading) return; // Prevent multiple clicks/submits
    
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
    } */}

       setResultData("");
       setLoading(true);
       setShowResult(true);
       setRecentPrompt(input); 
       const response = await runGeminiChat(input);
       setResultData(response);
       setLoading(false)
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
        setInput
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
