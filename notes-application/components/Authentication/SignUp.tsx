import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useMutation } from "urql";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Oval } from "react-loader-spinner";
import Head from "next/head";
import { CREATE_USER } from "../GraphQl/Mutation";

interface SignUpFormInput {
  displayName: string;
  email: string;
  password: string;
}

interface CreateUserResult {
  createUser: {
    id: string;
    name: string;
  };
}

interface CreateUserInput {
  name: string;
  id: string;
}

const schema = yup.object().shape({
  displayName: yup
    .string()
    .required("This is a required field")
    .max(30, "Name should be at max of 30 characters."),
  email: yup
    .string()
    .required("This is a required field")
    .email("Invalid email address."),
  password: yup
    .string()
    .required("This is a required field")
    .min(6, "Password must be at least 6 characters."),
});

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormInput>({
    resolver: yupResolver(schema),
  });
  const [err, setErr] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>();
  const [createUserResult, createUser] = useMutation<
    CreateUserResult,
    CreateUserInput
  >(CREATE_USER);

  const signUpSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
    const { email, password, displayName } = data;

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createUser({ name: displayName, id: user?.uid });
      createUserResult.data && reset();

      setErr(false);
    } catch (error: any) {
      setErr(true);
      switch (error.code) {
        case "auth/invalid-email":
          setErrorText("Invalid email");
          break;
        case "auth/user-not-found":
          setErrorText("User not found");
          break;
        case "auth/wrong-password":
          setErrorText("Wrong password");
          break;
        case "auth/email-already-in-use":
          setErrorText("Email already in use");
          break;
        default:
          console.log(error.message);
      }
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title key="Sign-Up">Notes App-Sign Up</title>
      </Head>
      <main className="flex flex-col p-1 gap-10 ">
        <h1 className=" uppercase text-4xl font-semibold text-center border-b border-b-1 border-cyan-500 text-cyan-500 p-2 ">
          Sign Up
        </h1>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(signUpSubmit)}
        >
          <label htmlFor="displayName" className="text-lg font-semibold">
            Name
          </label>
          <input
            id="displayName"
            {...register("displayName")}
            className="border-2 border-cyan-300 p-2 rounded-md focus:outline-cyan-500 focus:outline-2"
          />
          <ErrorMessage
            name="displayName"
            errors={errors}
            render={({ message }) => (
              <p className="text-xs text-red-500 p-1">{message}</p>
            )}
          />
          <label htmlFor="email" className="text-lg font-semibold">
            Email
          </label>
          <input
            id="email"
            {...register("email")}
            className="border-2 border-cyan-300 p-2 rounded-md focus:outline-cyan-500 focus:outline-2"
          />
          <ErrorMessage
            name="email"
            errors={errors}
            render={({ message }) => (
              <p className="text-xs text-red-500 p-1">{message}</p>
            )}
          />
          <label htmlFor="password" className="text-lg font-semibold">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            className="border-2 border-cyan-300 p-2 rounded-md focus:outline-cyan-500 focus:outline-2"
          />
          <button
            className=" bg-cyan-400 focus:bg-cyan-600 active:bg-cyan-300 p-2 rounded-md text-white"
            type="submit"
            name="submit"
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
              "Sign Up"
            )}
          </button>
          {err && <p className="text-xs text-red-500 p-1">{errorText}</p>}{" "}
        </form>
      </main>
    </React.Fragment>
  );
};

export default SignUp;
