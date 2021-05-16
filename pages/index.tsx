import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

const colors = [
  {
    label: "Red",
    value: "red",
    className: "bg-red-400 dark:bg-red-300",
  },
  {
    label: "Yellow",
    value: "yellow",
    className: "bg-yellow-400 dark:bg-yellow-300",
  },
  {
    label: "Green",
    value: "green",
    className: "bg-green-400 dark:bg-green-300",
  },
  {
    label: "Indigo",
    value: "indigo",
    className: "bg-indigo-400 dark:bg-indigo-300",
  },
  {
    label: "Purple",
    value: "purple",
    className: "bg-purple-400 dark:bg-purple-300",
  },
  {
    label: "Pink",
    value: "pink",
    className: "bg-pink-400 dark:bg-pink-300",
  },
];

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
          <button type="button" onClick={() => AuthUser.signOut()}>
            Logout
          </button>
        ) : (
          <button type="button" onClick={() => router.push("/auth")}>
            Login
          </button>
        )}
      </div>
      <div className="my-2 px-3 flex flex-wrap space-x-3">
        {colors.map((i) => (
          <button
            className={`w-4 h-4 rounded-full ${i.className}`}
            key={i.label}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
