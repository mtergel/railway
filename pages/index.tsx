import { Button, UserButton } from "../components";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
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
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { firebaseClient } from "../firebaseClient";

const Home = () => {
  const AuthUser = useAuthUser();

  const [folders, setFolders] = useState([]);

  const ref = firebaseClient
    .firestore()
    .collection("users")
    .doc(AuthUser.id)
    .collection("folders");

  useEffect(() => {
    const unsubscribe = ref.onSnapshot((snap) => {
      const data = snap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setFolders(data);
    });

    //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => unsubscribe();
  }, []);

  console.log("folders: ", folders);

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
            {folders.map((folder) => (
              <FolderItem
                title={folder.title}
                count={folder.count}
                key={folder.id}
              />
            ))}
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
