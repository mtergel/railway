import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Button } from "../components";
import { FaGithub } from "react-icons/fa";
const Auth = () => {
  const [loading, setLoading] = useState(false);

  const LoginWithGithub = async () => {
    setLoading(true);
    const githubProvider = new firebase.auth.GithubAuthProvider();
    const res = await firebase.auth().signInWithPopup(githubProvider);
    if (res.additionalUserInfo.isNewUser) {
      const usersRef = firebase.firestore().collection("users");
      await usersRef.doc(res.user.uid).set({
        id: res.user.uid,
        email: res.user.email,
      });
      await usersRef.doc(res.user.uid).collection("folders").add({
        title: "Notes",
        count: 0,
      });
      await usersRef.doc(res.user.uid).collection("folders").add({
        title: "Recently Deleted",
        count: 0,
      });
    }
    setLoading(false);
  };

  return (
    <div
      className="w-full h-full grid"
      style={{
        gridTemplateRows: "1fr auto 1fr",
      }}
    >
      <div className="hidden sm:flex" />
      <div className="flex m-auto flex-col p-6 gap-5 bg-gray-50 shadow-lg dark:bg-paper rounded-lg z-10 sm:w-400 w-full">
        <div className="flex gap-2 flex-col">
          <span className="text-3xl font-bold">Welcome</span>
          <div className="flex-wrap">
            By logging in you accept our&nbsp;
            <a
              href="/privacy-policy.html"
              className="text-indigo-400 dark:text-indigo-300 hover:underline"
            >
              Privacy Policy
            </a>
            &nbsp;and&nbsp;
            <a
              href="/terms.html"
              className="text-indigo-400 dark:text-indigo-300 hover:underline"
            >
              Terms of Service
            </a>
            .
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-2">
          <Button
            leftIcon={<FaGithub />}
            isLoading={loading}
            onClick={LoginWithGithub}
          >
            Login with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
