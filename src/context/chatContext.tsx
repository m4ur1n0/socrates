"use client"

import { Conversation } from "@/types/Conversation"
import { createContext, ReactNode, useContext, useState } from "react"

interface ChatContextType {
    chatHistory : any[]
    questionsHistory : any[]
    textbookContext : any | any[]
    setChatHistory : Function
    setQuestionsHistory : Function
    setTextbookContext : Function
    conversationStruct : Conversation | null
    setConversationStruct : Function

  }
  
  const ChatContext = createContext<ChatContextType>({
    chatHistory : [],
    questionsHistory : [],
    textbookContext : [],
    conversationStruct : null,

    setChatHistory : () => {},
    setQuestionsHistory : () => {},
    setTextbookContext : () => {},
    setConversationStruct : () => {},

  })
  
  // Hook for user context
  // eslint-disable-next-line react-refresh/only-export-components
  export const useChat = () => useContext(ChatContext)


  const ChatContextProvider = ({ children }: { children: ReactNode }) => {

    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [questionsHistory, setQuestionsHistory] = useState<any[]>([]);
    const [textbookContext, setTextbookContext] = useState<any[]>([]);
    const [topicsList, setTopicsList] = useState<string[]>([]);
    const [conceptsHistory, setConceptsHistory] = useState<any[]>([]);
    const [currentConcept, setCurrentConcept] = useState<any>(null);
    const [conversationStruct, setConversationStruct] = useState<Conversation | null>(null);

   
    const value = {
        chatHistory,
        questionsHistory,
        textbookContext,
        topicsList,
        conceptsHistory,
        currentConcept,
        conversationStruct,
        
        setChatHistory,
        setQuestionsHistory,
        setTextbookContext,
        setTopicsList,
        setConceptsHistory,
        setCurrentConcept,
        setConversationStruct,
    }

    return (
        <ChatContext.Provider
            value = {value}
        >
            {children}
        </ChatContext.Provider>
    )
  }

export {ChatContextProvider, useContext}