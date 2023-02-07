import Head from "next/head";
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

type signup = {
  email: string,
  password: string,
  email_notifs: number,
  birthday: string,
  username: string
};

type login = {
  email: string,
  password: string
};

export default function Home() {

  const session = useSession();
  const supabase = useSupabaseClient();

  const [registerForm, setRegisterForm] = React.useState<signup>({ email: "", password: "", email_notifs: 0, birthday: "", username: "" });
  const [loginForm, setLoginForm] = React.useState<login>({ email: "", password: "" });
  const [loggingIn, setLoggingIn] = React.useState(true);
  const [notifsValues, setNotifsValues] = React.useState({ upd: false, recs: false, act: false });

  function handleLoginChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setLoginForm(old => {
      return {
        ...old,
        [name]: value
      };
    });
  }

  function handleRegisterChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setNotifsValues(old => {
        return {
          ...old,
          [name]: checked
        };
      });
    } else {
      setRegisterForm(old => {
        return {
          ...old,
          [name]: value
        };
      });
    }
  }

  function handleLogin() {

  }

  function handleRegister(): void {
    const updatedForm = new Promise<number>((resolve, reject) => {
      let notifsNum = 0;
      if (notifsValues.upd) {
        notifsNum += 1;
      }
      if (notifsValues.act) {
        notifsNum += 2;
      }
      if (notifsValues.recs) {
        notifsNum += 4;
      }
      resolve(notifsNum);
    })
    updatedForm
      .then(notifsNum => setRegisterForm(old => {
        return {
          ...old,
          email_notifs: notifsNum
        };
      }))
      .then(async () => {
        const {data, error} = await supabase.auth.signUp({
          email: registerForm.email,
          password: registerForm.password,
          options: {
            data: {
              email_notifs: registerForm.email_notifs,
              birthday: registerForm.birthday,
              username: registerForm.username,
            }
          }
        })
        if(error) {
          console.log(`ERROR: ${JSON.stringify(error, null, 2)}`)
        } else {
          console.log(`DATA: ${JSON.stringify(data, null, 2)}`)
        }
      });
  }

  return (
    <>
      <Head>
        <title>Gift App</title>
        <meta name="description" content="A gift coordinating app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-full h-screen flex justify-center items-center">
          {!session ? (
            <div className="h-fit w-64 flex flex-col justify-center items-center">
              <h1 className="text-center text-bold">Please log in or sign up</h1>
              {
                loggingIn ?
                  <div className="">
                    <label>
                      email:
                      <input type="email" value={loginForm?.email} onChange={e => handleLoginChange(e)} name="email"></input>
                    </label>
                    <label>
                      password:
                      <input type="password" value={loginForm?.password} onChange={e => handleLoginChange(e)} name="password"></input>
                    </label>
                    <button>Sign in</button>
                    <p className="text-grey hover:cursor-pointer underline" onClick={() => { setLoggingIn(old => !old) }}>Don&apos;t have an account? Register</p>
                  </div>
                  :
                  <div className="">
                    <label>
                      email:
                      <input type="text" value={registerForm?.email} onChange={e => handleRegisterChange(e)} name="email"></input>
                    </label>
                    <label>
                      password:
                      <input type="password" value={registerForm?.password} onChange={e => handleRegisterChange(e)} name="password"></input>
                    </label>
                    <label>
                      birthday:
                      <input type="date" value={registerForm.birthday} onChange={e => handleRegisterChange(e)} name="birthday"></input>
                    </label>
                    <label>
                      username:
                      <input type="text" value={registerForm.username} onChange={e => handleRegisterChange(e)} name="username"></input>
                    </label>
                    <label>
                      Receive emails for updates and announcements?
                      <input type="checkbox" checked={notifsValues.upd} name="upd" onChange={e => handleRegisterChange(e)}></input>
                    </label>
                    <label>
                      Receive emails for recommendations?
                      <input type="checkbox" checked={notifsValues.recs} name="recs" onChange={e => handleRegisterChange(e)}></input>
                    </label>
                    <label>
                      Receive email notifications for activity? (event notifications, users, comments, etc)
                      <input type="checkbox" checked={notifsValues.act} name="act" onChange={e => handleRegisterChange(e)}></input>
                    </label>
                    <button onClick={handleRegister}>Register</button>
                    <p className="text-grey hover:cursor-pointer underline" onClick={() => { setLoggingIn(old => !old) }}>Log in instead</p>
                  </div>
              }
            </div>
          ) : (
            <>
              <p>Signed in!</p>
              <button>Log out</button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
