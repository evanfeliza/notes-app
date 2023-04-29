import React, { useContext, useEffect, useState } from "react";
import Login from "../components/Authentication/Login";
import SignUp from "@/components/Authentication/SignUp";
import { CgNotes } from "react-icons/cg";
import Head from "next/head";
import { AuthContext } from "@/context/auth/AuthContext";
import { useRouter } from "next/router";

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      router.push(`/dashboard/${currentUser.uid}`);
    }
  }, [currentUser, router]);

  return (
    <React.Fragment>
      <Head>
        <title key="title">NotesApp&apos;s Home</title>
      </Head>

      <main className="min-h-[100vh] w-full flex justify-center items-center p-4">
        <div className="max-h-full w-full xs:4/5 sm:w-2/3 lg:w-1/2 sm:grid grid-cols-2 shadow-md rounded-lg overflow-hidden">
          <div className="flex items-center justify-center bg-cyan-400 px-2 py-4">
            <span className="text-white text-[15rem] opacity-50 ">
              <CgNotes />
            </span>
          </div>

          <div className="flex flex-col px-4 py-6 gap-10 max-h-full max-w-[full]">
            {isRegistered ? <Login /> : <SignUp />}
            {!isRegistered ? (
              <p>
                Already have an account?
                <a
                  className="underline hover:text-cyan-400 cursor-pointer"
                  onClick={() =>
                    setIsRegistered((prevRegistered) => !prevRegistered)
                  }
                >
                  Log In
                </a>
              </p>
            ) : (
              <p>
                Don't have an Account?
                <a
                  className="underline hover:text-cyan-400 cursor-pointer"
                  onClick={() =>
                    setIsRegistered((prevRegistered) => !prevRegistered)
                  }
                >
                  Register
                </a>
              </p>
            )}
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
