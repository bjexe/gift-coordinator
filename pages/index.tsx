import Head from "next/head";
import React, { ChangeEvent } from 'react';

interface LoginForm {
    username: string,
    password: string
};

interface RegisterForm {
    username: string,
    email: string,
    password: string
};

export default function Home() {

    const [loginFormData, setLoginFormData] = React.useState<LoginForm>({username: "", password: ""});
    const [registerFormData, setRegisterFormData] = React.useState<RegisterForm>({username: "", email: "", password: ""});

    function handleLoginFormChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setLoginFormData(oldForm => {
            return {
                ...oldForm,
                [name]: value
            };
        })
    }

    function handleRegisterFormChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setRegisterFormData(oldForm => {
            return {
                ...oldForm,
                [name]: value
            };
        })
    }

    function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("fake login submit");
    }

    function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("fake register submit")
    }

  return (
    <>
      <Head>
        <title>index</title>
        <meta name="description" content="this is the index page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white pt-10">
          <h1 className="text-center text-5xl mb-20">Name of website</h1>
          <form onSubmit={ e => handleLoginSubmit(e) } className="flex flex-col gap-10 items-center">
            <h1 className="text-3xl">Login</h1>
            <label>
                Username:
                <input type="text" name="username" value={ loginFormData.username } onChange={ e => handleLoginFormChange(e) } className="text-black ml-3"/>
            </label>
            <label>
                Password:
                <input type="password" name="password" value={ loginFormData.password } onChange={ e => handleLoginFormChange(e) } className="text-black ml-3"/>
            </label>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Log in</button>
          </form>
          <hr className="mt-20"/>
          <form onSubmit={ e => handleRegisterSubmit(e) } className="flex flex-col gap-10 items-center">
            <h1 className="text-3xl mt-20">Register</h1>
            <label>
                Username:
                <input type="text" name="username" value={ registerFormData.username } onChange={ e => handleRegisterFormChange(e) } className="text-black ml-3"/>
            </label>
            <label>
                Password:
                <input type="password" name="password" value={ registerFormData.password } onChange={ e => handleRegisterFormChange(e) } className="text-black ml-3"/>
            </label>
            <label>
                Email:
                <input type="email" name="email" value={ registerFormData.email } onChange={ e => handleRegisterFormChange(e) } className="text-black ml-3"/>
            </label>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</button>
          </form>
        </div>
      </main>
    </>
  );
}
