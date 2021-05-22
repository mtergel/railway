import { useEffect, useState } from "react";
import { firebaseClient } from "../../firebaseClient";
import { useNotesContext } from "../Context/NotesContext";

interface NoteGridProps {
  userId: string;
}
export const NoteGrid: React.FC<NoteGridProps> = ({ userId }) => {
  const { state } = useNotesContext();
  const folderArr = state.selectedPath ? state.selectedPath.split("/") : [];
  const folderId: string | undefined = folderArr[folderArr.length - 1];
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (userId !== "" && state.selectedPath && folderId) {
      let baseString = `users/${userId}/folders/`;
      folderArr.forEach((i, index) => {
        if (index === folderArr.length - 1) {
          baseString = baseString.concat(`${i}/notes`);
        } else {
          if (i !== "") {
            baseString = baseString.concat(`${i}/folders/`);
          }
        }
      });
      const ref = firebaseClient.firestore().collection(baseString);

      const unsubscribe = ref.onSnapshot((snap) => {
        const data = snap.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setNotes(data);
      });

      return () => unsubscribe();
    }
  }, [userId, state.selectedPath, folderId]);

  if (userId === "") {
    return null;
  } else {
    return <div className="grid grid-flow-col auto-cols-185"></div>;
  }
};
