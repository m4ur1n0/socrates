export interface User {
    userId: string
    name: string
    email: string | null
    profilePic: string
    conversationIds : string[]
  }