import { User } from "@/types/user"
import { createContext, ReactNode, useContext, useState } from "react"

interface UserContextType {
    user: User | null
    handleSignIn: () => Promise<boolean>
    handleSignOut: () => Promise<void>
    refreshUser: () => Promise<void>
  }
  
  const UserContext = createContext<UserContextType>({
    user: null,
    handleSignIn: async () => false,
    handleSignOut: async () => {},
    refreshUser: async () => {},
  })
  
  // Hook for user context
  // eslint-disable-next-line react-refresh/only-export-components
  export const useUser = () => useContext(UserContext)


  const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    

    const value = {
        user
    }

    return (
        <UserContext.Provider
            value = {value}
        >
            {children}
        </UserContext.Provider>
    )
  }