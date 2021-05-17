import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { Button } from "../components";

const Home = () => {
  const { theme, setTheme } = useTheme();

  const AuthUser = useAuthUser();
  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }
      >
        Toggle theme
      </button>
      <div className="p-3 font-bold">
        Your email: {AuthUser.email ? AuthUser.email : "Not Logged In"}
      </div>
      <div>
        {AuthUser.firebaseUser ? (
          <Button
            color="primary"
            variant="ghost"
            onClick={() => AuthUser.signOut()}
          >
            Logout
          </Button>
        ) : (
          <button type="button" onClick={() => router.push("/auth")}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
