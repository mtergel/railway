import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { Button, IconButton, UserButton } from "../components";
import firebase from "firebase/app";
import "firebase/firestore";

import {
  IoTrashOutline,
  IoTextOutline,
  IoCreateOutline,
  IoCheckmarkCircleOutline,
  IoImagesOutline,
  IoAddCircleOutline,
} from "react-icons/io5";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import FolderItem from "../components/Folders/FolderItem";
import { useEffect } from "react";

const Home = () => {
  const AuthUser = useAuthUser();

  useEffect(() => {
    console.log("running realtime updates ?");
    firebase
      .firestore()
      .collection("users")
      .doc("SXcp7GKwT0AiOYclXskN")
      .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
      });
  }, []);

  return (
    <ReflexContainer orientation="vertical">
      <ReflexElement
        minSize={150}
        maxSize={300}
        style={{
          overflow: "visibile !important",
        }}
      >
        <div className="bg-paper h-full p-2 space-y-4 flex flex-col">
          <div>
            <UserButton user={AuthUser} />
          </div>
          <div className="flex-grow">
            <div className="text-xs text-text-secondary mb-2">Folders</div>
            {/* <FolderItem title="Notes" count={1} active /> */}
            {/* <FolderItem title="Recently Deleted" count={3} /> */}
          </div>
          <Button variant="ghost" leftIcon={<IoAddCircleOutline />}>
            New folder
          </Button>
        </div>
      </ReflexElement>
      <ReflexSplitter />

      <ReflexElement>
        <div className="pane-content">
          <label>Left Pane (resizable)</label>
        </div>
      </ReflexElement>
    </ReflexContainer>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

// {/* <div className="flex space-x-2 items-center">
//         <UserButton user={AuthUser} />
//         <IconButton aria-label="delete" variant="ghost">
//           <IoTrashOutline />
//         </IconButton>
//         <IconButton aria-label="font" variant="ghost">
//           <IoTextOutline />
//         </IconButton>
//         <IconButton aria-label="create" variant="ghost">
//           <IoCreateOutline />
//         </IconButton>
//         <IconButton aria-label="check" variant="ghost">
//           <IoCheckmarkCircleOutline />
//         </IconButton>
//         <IconButton aria-label="images" variant="ghost">
//           <IoImagesOutline />
//         </IconButton>
//       </div> */}
