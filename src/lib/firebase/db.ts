import type { User as FirebaseUser } from "firebase/auth"
import { User } from "@/types/user"
import { set, ref, get, update } from "firebase/database"
import { database } from "./firebaseConfig"

// User Functions
export const addUser = async (user: FirebaseUser) => {
    const { uid, photoURL, email, displayName } = user
  
    const userData: User = {
      userId: uid,
      name: displayName || "",
      email: email || "",
      profilePic: photoURL || "",
      conversationIds : [],
    }
  
    try {
      await set(ref(database, `users/${uid}`), userData)
      console.log(`User added! ${uid}`)
      return true
    } catch (error) {
      console.log("Error creating user:", error)
      return false
    }
  }
  
  export const updateUserStatus = async (userId: string, status: boolean) => {
    try {
      await update(ref(database, `users/${userId}`), { status: status })
      return true
    } catch (err) {
      console.log(`failed to update user ${userId}`, err)
      return false
    }
  }
  
  export const getUser = async (userId: string) => {
    try {
      const userRef = ref(database, `users/${userId}`)
      const snapshot = await get(userRef)
  
      if (snapshot.exists()) {
        return snapshot.val() as User
      } else {
        console.log(`Could not find user with id ${userId}`)
        return null
      }
    } catch (err) {
      console.log(`An error occurred while trying to get user ${userId}:`, err)
      return null
    }
  }
  
  export const getAllUsers = async (): Promise<User[]> => {
    try {
      const dbSnapshot = await get(ref(database, "users"))
      if (!dbSnapshot.exists()) {
        throw new Error(
          "Database snapshot didn't exist... database could not be reached?"
        )
      }
  
      const usersData = dbSnapshot.val() // users object like { userId : {userData}, ...}
  
      return usersData as User[]
    } catch (err) {
      console.log(`ERROR occurred when trying to fetch all users : `, err)
      return []
    }
  }