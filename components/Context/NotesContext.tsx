import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { createContext, useContext, useEffect, useState } from "react";
import { firebaseClient } from "../../firebaseClient";
import debounce from "lodash/debounce";

interface NotesState {
  selectedPath: string | null;
  selectedNote: string | null;
}

type stateKey = "selectedPath" | "selectedNote";

interface NotesContext {
  state: NotesState;
  update: (key: stateKey, value: string | null) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  backgroundUpdate: boolean;
  setBgUpdate: (value: boolean) => void;
}
const NotesContext = createContext<NotesContext>(null);

const NotesWrapper = ({ children }) => {
  const [selectedState, setSelectedState] = useState<NotesState>({
    selectedPath: null,
    selectedNote: null,
  });

  const [loading, setLoading] = useState(true);
  const handleSetLoading = (value: boolean) => {
    setLoading(value);
  };

  const [backgroundUpdate, setBgUpdate] = useState(true);
  const handleSetBgUpdate = (value: boolean) => {
    setBgUpdate(value);
  };

  const AuthUser = useAuthUser();
  const userRef = AuthUser.id
    ? firebaseClient.firestore().collection("users").doc(AuthUser.id)
    : null;

  const handleUpdate = (key: stateKey, value: string | null) => {
    setSelectedState((prevState) => {
      let oldState = { ...prevState };
      oldState[key] = value;

      return oldState;
    });

    delayedUpdate(key, value);
  };

  const delayedUpdate = debounce(
    async (key: stateKey, value: string | null) => {
      // update user
      if (userRef) {
        try {
          handleSetBgUpdate(true);
          if (key === "selectedNote") {
            await userRef.update({
              selectedNote: value ? value : "",
            });
          } else {
            await userRef.update({
              selectedPath: value ? value : "",
            });
          }
          handleSetBgUpdate(false);
        } catch (error) {}
      }
    },
    1000
  );

  const checkStringEmpty = (input: string) => {
    if (input && input !== "") {
      return input;
    } else {
      return null;
    }
  };
  const updateWithUserHistory = async () => {
    try {
      handleSetLoading(true);

      if (AuthUser && userRef) {
        const userProfileInfo = (await userRef.get()).data();
        handleUpdate(
          "selectedPath",
          checkStringEmpty(userProfileInfo.selectedPath)
        );
        handleUpdate(
          "selectedNote",
          checkStringEmpty(userProfileInfo.selectedNote)
        );
      } else {
        handleUpdate("selectedPath", null);
        handleUpdate("selectedNote", null);
      }
      handleSetLoading(false);
    } catch (error) {
      console.log("error occured when trying to fetch user");
    }
  };
  useEffect(() => {
    updateWithUserHistory();
  }, [AuthUser]);

  console.log(selectedState);

  return (
    <NotesContext.Provider
      value={{
        state: selectedState,
        update: handleUpdate,
        loading,
        setLoading: handleSetLoading,
        backgroundUpdate,
        setBgUpdate: handleSetBgUpdate,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export default withAuthUser()(NotesWrapper);

export const useNotesContext = () => {
  return useContext(NotesContext);
};
