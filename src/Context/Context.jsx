import { createContext, useState } from "react";
import runGeminiChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [loading, setLoading] = useState(false);

    const onSent = async (prompt) => {
        if (loading) return; // Prevent calling if already running
        
        try {
            setLoading(true);
            const response = await runGeminiChat(prompt);
            console.log(response);
            return response;
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false); // Always turn off loading state
        }
    };

    const contextValue = {
        onSent,
        loading, // Pass this down so your UI can disable buttons
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
