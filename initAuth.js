// ./initAuth.js
import { init } from "next-firebase-auth";

const initAuth = () => {
  init({
    authPageURL: "/auth",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: "railway-93c4c",
        // The private key must not be accesssible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail:
          "firebase-adminsdk-bnrzt@railway-93c4c.iam.gserviceaccount.com",
      },
      // databaseURL: "https://my-example-app.firebaseio.com",
    },
    firebaseClientInitConfig: {
      apiKey: "AIzaSyBPvjoCfU4S1ulBqntjAB9uB4YEXQi8DQQ", // required
      authDomain: "railway-93c4c.firebaseapp.com",
      // databaseURL: "https://my-example-app.firebaseio.com",
      projectId: "railway-93c4c",
      storageBucket: "railway-93c4c.appspot.com",
      messagingSenderId: "584699026385",
      appId: "1:584699026385:web:e54e3115a3d86690649ef0",
      measurementId: "G-4K7RKYY8QZ",
    },
    cookies: {
      name: "Railway", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true,
    },
  });
};

export default initAuth;
