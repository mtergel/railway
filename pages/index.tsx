import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { UserButton } from "../components";

const Home = () => {
  const AuthUser = useAuthUser();

  return (
    <div>
      <div className="w-56">
        <UserButton user={AuthUser} />
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
