import { Button, RichEditor, UserButton } from "../components";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { IoAddCircleOutline } from "react-icons/io5";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import FolderItem from "../components/Folders/FolderItem";
import { useEffect, useState } from "react";
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
        <div className="bg-paper py-2 px-4 space-y-4 flex flex-col h-screen sticky top-0">
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
        <RichEditor />
      </ReflexElement>
    </ReflexContainer>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
