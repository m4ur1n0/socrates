"use client"
// import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import {toast} from "sonner";


export default function Home() {

  const {user, handleSignIn} = useUser();

  const router = useRouter();

  async function handleLogin() {
    await handleSignIn();
    if (user) {
      router.push('/chat');
    } else {
      toast.error(
        "Sorry, there was an issue logging you in.",
        // {
        //   description : "Please try again in a moment.",
        // }
      )
    }
  }

  return (
    <main
      className="
        flex h-screen w-full
        bg-gradient-to-tr from-[#594857] via-[#b0cde0] to-[#00326c]
        text-white
      "
    >
      {/* Left panel */}
      <section className="flex flex-1 flex-col justify-center px-8 md:px-16 bg-transparent">
        {/* Logo & Brand */}
        <div className="flex items-center mb-6">
          <span className="text-3xl font-bold tracking-tight">
            Socratic Inc.
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-lg drop-shadow-lg">
          Welcome to{" "}
          <span
            className="
              bg-gradient-to-r from-[#b0cde0] via-white to-[#b0cde0]
              bg-clip-text text-transparent
            "
          >
            Socrates.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-lg max-w-md text-white/80">
          Your mastery begins here.
        </p>

        {/* Call to Action */}
        <button
          onClick={handleLogin}
          className="
            mt-8 inline-flex items-center
            px-8 py-3 
            bg-[#b0cde0] text-[#00326c]
            font-semibold rounded-full
            shadow-lg hover:opacity-90
            focus:outline-none focus:ring-4 focus:ring-[#b0cde0]/50
            transition
            cursor-pointer
          "
        >
          Get Started
        </button>
      </section>

      {/* Right panel with transparent-framed image */}
      <section className="hidden md:flex flex-1 items-center justify-center p-8 bg-transparent">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="/images/landing.png"
            alt="Abstract Socrates illustration"
            className="w-auto h-[80vh] object-contain block bg-transparent"
          />
        </div>
      </section>
    </main>
  );
}
