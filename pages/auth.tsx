import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Button } from "../components";
import { FaGithub } from "react-icons/fa";
import { firebaseClient } from "../firebaseClient";
import { useNotesContext } from "../components/Context/NotesContext";
import Head from "next/head";
const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { update } = useNotesContext();
  const LoginWithGithub = async () => {
    setLoading(true);
    const githubProvider = new firebase.auth.GithubAuthProvider();
    const res = await firebase.auth().signInWithPopup(githubProvider);
    if (res.additionalUserInfo.isNewUser) {
      const usersRef = firebase.firestore().collection("users");
      await usersRef.doc(res.user.uid).set({
        id: res.user.uid,
        email: res.user.email,
        folderNames: ["Notes"],
        lastFolderOrder: 0,
      });
      const newFolderRef = await usersRef
        .doc(res.user.uid)
        .collection("folders")
        .add({
          title: "Notes",
          count: 1,
          order: 0,
          isDeletable: false,
        });

      const newNoteId = await usersRef
        .doc(res.user.uid)
        .collection("folders")
        .doc(newFolderRef.id)
        .collection("notes")
        .add({
          content: `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a basic <em>basic</em> example of <strong>railway powered by tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
        display: none;
      }</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <ul data-type="taskList"><li data-checked="false"><label contenteditable="false"><input type="checkbox"><span></span></label><div><p>Checklist Item 1</p></div></li><li data-checked="false"><label contenteditable="false"><input type="checkbox"><span></span></label><div><p>Checklist Item 2</p></div></li></ul>
        <blockquote>
          Nice! 👏
          <br />
        </blockquote>
      `,
          updated: firebaseClient.firestore.FieldValue.serverTimestamp(),
        });
      console.log(newNoteId.id);
      await usersRef.doc(res.user.uid).update({
        selectedNote: newNoteId.id,
        selectedFolder: newFolderRef.id,
      });

      update("selectedNote", newNoteId.id);
      update("selectedPath", newFolderRef.id);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Login | Railroad</title>
      </Head>
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateRows: "1fr auto 1fr",
        }}
      >
        <div className="hidden sm:flex" />
        <div className="flex m-auto flex-col p-6 gap-5 bg-gray-50 shadow-lg dark:bg-paper rounded-lg z-10 sm:w-400 w-full">
          <div className="flex gap-2 flex-col">
            <span className="text-3xl font-bold">Welcome to Railroad</span>
            <div className="text-sm">
              This is an clone of MacOS Notes app. It has an autosave feature so
              it requires authentication.
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
    </>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
