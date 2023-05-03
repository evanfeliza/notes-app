import { signOut } from "firebase/auth";
import React, { useState, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { auth } from "../../firebase";
import { AuthContext } from "@/context/auth/AuthContext";
import { useMutation } from "urql";
import { DELETE_USER } from "../GraphQl/Mutation";

interface UserProp {
  id: string;
  name: string;
}

interface User {
  user?: UserProp;
}

interface NavProp {
  data: User;
}

const Navbar: React.FC<NavProp> = ({ data }) => {
  const [isSettings, setIsSettings] = useState(false);
  const [deleteUserResult, deleteUserMutation] = useMutation(DELETE_USER);

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleDeleteUser = async () => {
    try {
      await auth.currentUser?.delete();
      await deleteUserMutation({ id: data.user?.id as string });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-cyan-500 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 p-2">
          <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <h3 className="text-white text-2xl md:text-4xl font-extrabold uppercase ">
                Notes App
              </h3>
            </div>
          </div>
          <div className="md:flex items-center justify-center rounded-full">
            <h1 className="hidden md:flex text-white text-lg font-semibold">
              {data && data.user && data.user.name}
            </h1>
            <button
              className="relative text-black p-2"
              onClick={() => setIsSettings((prevIsSetting) => !prevIsSetting)}
            >
              <span className="text-white text-3xl md:text-4xl hover:border hover:boreder-1 hover:border-white hover:text-slate-400 duration-500  active:text-cyan-300">
                <FaUserCircle />
              </span>
            </button>
            {isSettings && (
              <ul className="z-50 absolute top-[60px] right-5 sm:right-[50px] lg:right-[200px] bg-white rounded-lg drop-shadow-md overflow-hidden divide-y divide-y-1 divide-cyan-500">
                <li
                  className="cursor-pointer px-4 py-1 hover:bg-slate-300 active:bg-cyan-500 "
                  onClick={handleSignOut}
                >
                  Sign Out
                </li>
                <li
                  className="cursor-pointer px-4 py-1 hover:bg-slate-300 active:bg-cyan-500"
                  onClick={handleDeleteUser}
                >
                  Delete User
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
