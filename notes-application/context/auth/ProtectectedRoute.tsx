import React, { useEffect, useContext, ReactNode } from "react";
import { AuthContext } from "@/context/auth/AuthContext";
import { useRouter } from "next/router";
import { Oval } from "react-loader-spinner";

export interface ProtectRouteProp {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectRouteProp> = ({
  children,
}: ProtectRouteProp) => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    <div className="flex items-center justify-center h-screen w-screen">
      <Oval
        height={50}
        width={50}
        color="cyan"
        secondaryColor="white"
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        strokeWidth={7}
      />
    </div>;
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
