"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { UserRoundIcon } from "lucide-react";

export default function Home() {

  const {user, handleSignIn} = useUser();

  return (
    <div className="homepage-total">
      Welcome to scortarse

      <Button variant={'outline'} onClick={handleSignIn}>
        Log In
      </Button>

      <p>
        { user ? 
          user.userId : 
          'xxx'
        }
      </p>

    </div>
  );
}
