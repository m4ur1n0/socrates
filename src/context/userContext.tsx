"use client"
import { signInWithGoogle } from "@/lib/auth"
import { addUser, getUser } from "@/lib/firebase/db"
import { auth } from "@/lib/firebase/firebaseConfig"
import { User } from "@/types/user"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import type { User as FirebaseUser } from "firebase/auth"


interface UserContextType {
    user: User | null
    loading : boolean
    handleSignIn: () => Promise<boolean>
    handleSignOut: () => Promise<void>
    refreshUser: () => Promise<void>
  }
  
  const UserContext = createContext<UserContextType>({
    user: null,
    loading : false,
    handleSignIn: async () => false,
    handleSignOut: async () => {},
    refreshUser: async () => {},
  })
  
  // Hook for user context
  // eslint-disable-next-line react-refresh/only-export-components
  export const useUser = () => useContext(UserContext)


  const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false)



    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true)
        if (firebaseUser) {
          try {
            const profile = await getUser(firebaseUser.uid)
            if (profile) {
              setUser(profile as User)
            } else {
              console.error("Could not fetch user profile, logging out")
              await handleSignOut()
            }
          } catch (error) {
            console.error("Error fetching user profile:", error)
            await handleSignOut()
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      })
  
      return unsubscribe
    }, [])

    async function refreshUser() {
      try {
        if (!user) {
          throw new Error("Cannot refresh without user already logged in.")
        } else {
          const u = await getUser(user.userId)
          setUser(u as User)
        }
      } catch (err) {
        console.error("Error fetching user profile:", err)
        await handleSignOut()
      }
    }

    const handleSignIn = async () => {
      const userData = await signInWithGoogle()
      if (userData) {
        const profile = await getUser(userData.uid);
  
        if (profile) {
          setUser(profile as User)
        } else {
          console.error("Could not fetch user profile, attempting to add a new user");
          const success = await addUser(userData as FirebaseUser);

          if (!success) {

            console.error("User add failed... aborting.");
            await handleSignOut()
            return false;

          } else {

            const isThereABetterWayToDoThis = await getUser(userData.userId || "xxx");
            if (!isThereABetterWayToDoThis) {
              console.error("User add failed... aborting.");
              await handleSignOut()
              return false;
            } else {
              setUser(isThereABetterWayToDoThis);
              return true;

            }

          }
        }
  
        return true
      }
      return false
    }
  
    const handleSignOut = async () => {
      try {
        await signOut(auth)
        setUser(null)
      } catch (error) {
        console.error("Error during sign-out:", error)
      }
    }

    

    const value = {
        user,
        loading,
        handleSignIn,
        handleSignOut,
        refreshUser,
    }

    return (
        <UserContext.Provider
            value = {value}
        >
            {children}
        </UserContext.Provider>
    )
  }

export {UserContextProvider, useContext}