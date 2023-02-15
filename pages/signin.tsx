import Head from "next/head";
import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { buttonStyle } from "@/styles/buttonsClasses";
import { formFieldStyle, inputStyle} from "@/styles/formClasses";

type signup = {
  email: string;
  password: string;
  email_notifs: number;
  birthday: string;
  username: string;
};

type login = {
  email: string;
  password: string;
};

export default function SignIn() {

  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [registerForm, setRegisterForm] = React.useState<signup>({
    email: "",
    password: "",
    email_notifs: 0,
    birthday: "",
    username: "",
  });
  const [loginForm, setLoginForm] = React.useState<login>({
    email: "",
    password: "",
  });
  const [loggingIn, setLoggingIn] = React.useState(true);
  const [notifsValues, setNotifsValues] = React.useState({
    upd: false,
    recs: false,
    act: false,
  });

  const [renderBuffer, setRenderBuffer] = React.useState(false);

  React.useEffect(() => {
    if(session) {
      router.push('/home');
    }
  }, [session]);

  function handleLoginChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setLoginForm((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  }

  function handleRegisterChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setNotifsValues((old) => {
        return {
          ...old,
          [name]: checked,
        };
      });
    } else {
      setRegisterForm((old) => {
        return {
          ...old,
          [name]: value,
        };
      });
    }
  }

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });
    if (error) {
      console.log(JSON.stringify(error, null, 2));
    } else if(data) {
      router.push({
        pathname: '/home'
      })
    } else {
      throw new Error('supabase auth failed with no error');
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("error logging out");
    }
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
    });
    updatedForm
      .then((notifsNum) =>
        setRegisterForm((old) => {
          return {
            ...old,
            email_notifs: notifsNum,
          };
        })
      )
      .then(async () => {
        const { data, error } = await supabase.auth.signUp({
          email: registerForm.email,
          password: registerForm.password,
          options: {
            data: {
              email_notifs: registerForm.email_notifs,
              birthday: registerForm.birthday,
              username: registerForm.username,
            },
          },
        });
        if (error) {
          console.log(`ERROR: ${JSON.stringify(error, null, 2)}`);
        } else {
          console.log(`DATA: ${JSON.stringify(data, null, 2)}`);
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
              <h1 className="text-center text-bold">
                Please log in or sign up
              </h1>
              {loggingIn ? (
                <div className={formFieldStyle}>
                  <label>
                    email:
                    <input
                      className={inputStyle}
                      type="email"
                      value={loginForm?.email}
                      onChange={(e) => handleLoginChange(e)}
                      name="email"
                    ></input>
                  </label>
                  <label>
                    password:
                    <input
                      className={inputStyle}
                      type="password"
                      value={loginForm?.password}
                      onChange={(e) => handleLoginChange(e)}
                      name="password"
                    ></input>
                  </label>
                  <button
                    className={`${buttonStyle} self-center`}
                    onClick={handleLogin}
                  >
                    Sign in
                  </button>
                  <p
                    className="text-grey hover:cursor-pointer underline"
                    onClick={() => {
                      setLoggingIn((old) => !old);
                    }}
                  >
                    Don&apos;t have an account? Register
                  </p>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-left">
                  <label>
                    email:
                    <input
                      className={inputStyle}
                      type="text"
                      value={registerForm?.email}
                      onChange={(e) => handleRegisterChange(e)}
                      name="email"
                    ></input>
                  </label>
                  <label>
                    password:
                    <input
                      className={inputStyle}
                      type="password"
                      value={registerForm?.password}
                      onChange={(e) => handleRegisterChange(e)}
                      name="password"
                    ></input>
                  </label>
                  <label>
                    birthday:
                    <input
                      className={inputStyle}
                      type="date"
                      value={registerForm.birthday}
                      onChange={(e) => handleRegisterChange(e)}
                      name="birthday"
                    ></input>
                  </label>
                  <label>
                    username:
                    <input
                      className={inputStyle}
                      type="text"
                      value={registerForm.username}
                      onChange={(e) => handleRegisterChange(e)}
                      name="username"
                    ></input>
                  </label>
                  <label>
                    Receive emails for updates and announcements?
                    <input
                      className={inputStyle}
                      type="checkbox"
                      checked={notifsValues.upd}
                      name="upd"
                      onChange={(e) => handleRegisterChange(e)}
                    ></input>
                  </label>
                  <label>
                    Receive emails for recommendations?
                    <input
                      className={inputStyle}
                      type="checkbox"
                      checked={notifsValues.recs}
                      name="recs"
                      onChange={(e) => handleRegisterChange(e)}
                    ></input>
                  </label>
                  <label>
                    Receive email notifications for activity? (event
                    notifications, users, comments, etc)
                    <input
                      className={inputStyle}
                      type="checkbox"
                      checked={notifsValues.act}
                      name="act"
                      onChange={(e) => handleRegisterChange(e)}
                    ></input>
                  </label>
                  <button className={buttonStyle} onClick={handleRegister}>
                    Register
                  </button>
                  <p
                    className="text-grey hover:cursor-pointer underline"
                    onClick={() => {
                      setLoggingIn((old) => !old);
                    }}
                  >
                    Have an account? Log in
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-6">
              <p>Signed in!</p>
              <button
                className={`${buttonStyle} flex flex-col justify-self-center`}
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
