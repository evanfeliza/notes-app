import React, { useContext, useEffect, useState } from "react";
import useUser from "@/components/GraphQl/useUser";
import Navbar from "@/components/Dash/Navbar";
import ProtectedRoute from "@/context/auth/ProtectectedRoute";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import NoteList from "@/components/Dash/NoteList";
import InputNote from "@/components/Dash/InputNote";
import { IoIosAddCircle } from "react-icons/io";
import { Oval } from "react-loader-spinner";
import { User } from "firebase/auth";
import { AuthContext } from "@/context/auth/AuthContext";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const user = typeof params?.user === "string" ? params.user : "";

  return {
    props: { user },
  };
};

const UserPage: React.FC<User> = () => {
  const [isAddTask, setIsAddTask] = useState(false);
  const router = useRouter();
  const { data, fetching, error } = useUser(router.query.user as string);

  useEffect(() => {
    if (!data) {
      <span className="flex items-center justify-center h-full w-full">
        <Oval
          height={25}
          width={25}
          color="cyan"
          secondaryColor="white"
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          strokeWidth={7}
        />
      </span>;
    }
  }, [data]);

  return (
    <React.Fragment>
      <ProtectedRoute>
        <main className="h-screen w-auto">
          <Navbar data={data} />
          <div className="flex flex-col items-center justify-center">
            <div className="h-full w-full p-4">
              <div className=" bg-gradient-to-br from-cyan-500 to-cyan-400  shadow-lg  ">
                {!isAddTask ? (
                  <div className="flex items-center justify-center h-full max-h-full py-4">
                    <button
                      onClick={() => setIsAddTask(!isAddTask)}
                      className="text-white flex flex-col gap-2 uppercase"
                    >
                      <span className="text-[6rem] hover:drop-shadow-md hover:text-cyan-200 active:text-white duration-500">
                        {" "}
                        <IoIosAddCircle />
                      </span>

                      <span className="font-semibold mx-auto">New Task</span>
                    </button>
                  </div>
                ) : (
                  <InputNote addTask={isAddTask} />
                )}
              </div>

              {!fetching && <NoteList user={data.user?.id} />}
            </div>
          </div>
        </main>
      </ProtectedRoute>
    </React.Fragment>
  );
};

export default UserPage;
