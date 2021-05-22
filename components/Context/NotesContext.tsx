import { useAuthUser } from "next-firebase-auth";
import { createContext, useContext, useEffect, useState } from "react";
import { firebaseClient } from "../../firebaseClient";

interface NotesState {
  selectedPath: string | null;
  selectedNote: string | null;
}

type stateKey = "selectedPath" | "selectedNote";

interface NotesContext {
  state: NotesState;
  update: (key: stateKey, value: string | null) => void;
}
const NotesContext = createContext<NotesContext>(null);

export const NotesWrapper = ({ children }) => {
  const [selectedState, setSelectedState] = useState<NotesState>({
    selectedPath: "Notes",
    selectedNote: null,
  });

  const handleUpdate = (key: stateKey, value: string | null) => {
    setSelectedState((prevState) => {
      let oldState = { ...prevState };
      oldState[key] = value;
      return oldState;
    });
  };

  const AuthUser = useAuthUser();
  const userRef = AuthUser.id
    ? firebaseClient.firestore().collection("users").doc(AuthUser.id)
    : null;

  const checkStringEmpty = (input: string) => {
    if (input && input !== "") {
      return input;
    } else {
      return null;
    }
  };
  const updateWithUserHistory = async () => {
    try {
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
        handleUpdate("selectedPath", "Notes");
        handleUpdate("selectedNote", null);
      }
    } catch (error) {
      console.log("error occured when trying to fetch user");
    }
  };
  useEffect(() => {
    updateWithUserHistory();
  }, [AuthUser]);

  return (
    <NotesContext.Provider
      value={{
        state: selectedState,
        update: handleUpdate,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = () => {
  return useContext(NotesContext);
};
