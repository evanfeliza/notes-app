import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "@/context/auth/AuthContext";
import { useRouter } from "next/router";
import { Oval } from "react-loader-spinner";

export interface FormInputs {
  email: string;
  password: string;
}

const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required("This is a required field")
      .email("Invalid email address."),
    password: yup
      .string()
      .required("This is a required field")
      .min(6, "Password must be at least 6 characters."),
  })
  .required();

const Login: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [err, setErr] = useState(false);
  const [errorText, setErrorText] = useState<string>();

  const [isRegistered, setIsRegistered] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  const loginSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { email, password } = data;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setErr(true);
      switch (error.code) {
        case "auth/invalid-email":
          setErrorText("Invalid email");
          break;
        case "auth/user-not-found":
          setErrorText("User not found");
          break;
        case "auth/email-already-in-use":
          setErrorText("Email already in use");
          break;
        case "auth/wrong-password":
          setErrorText("Wrong password");
          break;
        case "auth/network-request-failed":
          setErrorText("Somthing wrong with your network");
          break;
        default:
          console.log(error.message);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      router.push(`/dashboard/${currentUser.uid}`);
    }
  }, [currentUser, router]);

  const handleRedirect = () => {
    if (currentUser) {
      router.replace(`/dashboard/${currentUser.uid}`);
    }
    console.log(currentUser);
  };

  return (
    <React.Fragment>
      <Head>
        <title key="title">Notes App-Login</title>
      </Head>

      <>
        <h1 className=" uppercase text-4xl font-semibold text-center border-b border-b-1 border-cyan-500 text-cyan-500 p-2 ">
          Login
        </h1>
        <form
          className="flex flex-col gap-2 w-full h-auto"
          onSubmit={handleSubmit(loginSubmit)}
        >
          <label className="text-lg font-semibold">Email</label>
          <input
            {...register("email")}
            className="border-2 border-cyan-300 p-2 rounded-md focus:outline-cyan-500 focus:outline-2"
          />
          <ErrorMessage
            name="email"
            errors={errors}
            render={({ message }) => (
              <p
                className={`text-red-500 p-1 text-xs ${
                  message ? "visible" : "invisible"
                }`}
              >
                {message}
              </p>
            )}
          />

          <label className="text-lg font-semibold">Password</label>
          <input
            {...register("password")}
            type="password"
            className="border-2 border-cyan-300 p-2 rounded-md focus:outline-cyan-500 focus:outline-2"
          />
          <ErrorMessage
            name="password"
            errors={errors}
            render={({ message }) => (
              <p
                className={`text-red-500 p-1 text-xs ${
                  message ? "visible" : "invisible"
                }`}
              >
                {message}
              </p>
            )}
          />
          <button
            className="bg-cyan-400 focus:bg-cyan-600 active:bg-cyan-300 p-2 rounded-md text-white font-semibold"
            onClick={handleRedirect}
          >
            {isSubmitting ? (
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
              </span>
            ) : (
              "Login"
            )}
          </button>
          {err && <p className={`text-red-500 p-1 text-xs `}>{errorText}</p>}
        </form>
      </>
    </React.Fragment>
  );
};

export default Login;
