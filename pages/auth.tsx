import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { AuthAction, withAuthUser } from "next-firebase-auth";
const styles = {
  content: {
    padding: `8px 32px`,
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    margin: 16,
  },
};

const Auth = () => {
  const LoginWithGithub = () => {
    const githubProvider = new firebase.auth.GithubAuthProvider();
    firebase
      .auth()
      .signInWithPopup(githubProvider)
      .then((result) => {
        // check if user exists
        const usersRef = firebase
          .firestore()
          .collection("Users")
          .doc(result.user.email);
        usersRef.get().then((doc) => {
          if (doc.exists) {
            // do nothing
            console.log("user exists");
          } else {
            usersRef.set({
              // set default color
              color: "indigo",
            });
          }
        });
      });
  };

  return (
    <div style={styles.content}>
      <h3>Sign in</h3>
      <div style={styles.textContainer}>
        <p>
          This auth page is <b>static</b>. It will redirect on the client side
          if the user is already authenticated.
        </p>
      </div>
      <div>
        <button onClick={() => LoginWithGithub()}>Github</button>
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
