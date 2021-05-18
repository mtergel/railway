import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { IconButton, UserButton } from "../components";

import {
  IoTrashOutline,
  IoTextOutline,
  IoCreateOutline,
  IoCheckmarkCircleOutline,
  IoImagesOutline,
} from "react-icons/io5";

const Home = () => {
  const AuthUser = useAuthUser();

  return (
    <div className="p-6">
      <div className="flex space-x-2 items-center">
        <UserButton user={AuthUser} />
        <IconButton aria-label="delete" variant="ghost">
          <IoTrashOutline />
        </IconButton>
        <IconButton aria-label="font" variant="ghost">
          <IoTextOutline />
        </IconButton>
        <IconButton aria-label="create" variant="ghost">
          <IoCreateOutline />
        </IconButton>
        <IconButton aria-label="check" variant="ghost">
          <IoCheckmarkCircleOutline />
        </IconButton>
        <IconButton aria-label="images" variant="ghost">
          <IoImagesOutline />
        </IconButton>
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
