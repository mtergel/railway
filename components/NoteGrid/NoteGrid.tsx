import clsx from "clsx";
import { useEffect, useState } from "react";
import { firebaseClient } from "../../firebaseClient";
import { mergeClasses } from "../../lib/mergeClass";
import { useNotesContext } from "../Context/NotesContext";
import Timestamp from "../Timestamp/Timestamp";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { IconButton } from "../Button";
import { RichEditor, RichEditorContainer } from "../Editor";

interface NoteGridProps {
  userId: string;
}
export const NoteGrid: React.FC<NoteGridProps> = ({ userId }) => {
  const { state, update } = useNotesContext();
  const folderArr = state.selectedPath ? state.selectedPath.split("/") : [];
  const folderId: string | undefined = folderArr[folderArr.length - 1];
  const [notes, setNotes] = useState([]);

  const getBasePath = () => {
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

      return baseString;
    }
  };

  // notes listender
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
    const addNote = async () => {
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
        const newNote = await ref.add({
          content: "",
          updated: firebaseClient.firestore.FieldValue.serverTimestamp(),
        });
        baseString = `users/${userId}/folders/`;
        folderArr.forEach((i, index) => {
          if (index === folderArr.length - 1) {
            baseString = baseString.concat(`${i}`);
          } else {
            if (i !== "") {
              baseString = baseString.concat(`${i}/folders/`);
            }
          }
        });

        firebaseClient
          .firestore()
          .doc(baseString)
          .update({
            count: notes.length + 1,
          });
        update("selectedNote", newNote.id);
      }
    };

    const deleteNote = async () => {
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
        await ref.doc(state.selectedNote).delete();
        baseString = `users/${userId}/folders/`;
        folderArr.forEach((i, index) => {
          if (index === folderArr.length - 1) {
            baseString = baseString.concat(`${i}`);
          } else {
            if (i !== "") {
              baseString = baseString.concat(`${i}/folders/`);
            }
          }
        });

        firebaseClient
          .firestore()
          .doc(baseString)
          .update({
            count: notes.length - 1,
          });

        // set it to last
        if (notes.length === 1) {
          update("selectedNote", null);
        } else {
          const deletedNoteIndex = notes.findIndex(
            (i) => i.id === state.selectedNote
          );
          // if not last
          if (deletedNoteIndex < notes.length - 1) {
            update("selectedNote", notes[deletedNoteIndex + 1].id);
          } else {
            // if its the last element set it the first
            update("selectedNote", notes[0].id);
          }
        }
      }
    };

    return (
      <div className="flex flex-grow">
        <div className="w-44 md:w-200 lg:w-275 flex-shrink-0 flex flex-col bg-default px-4 py-2 border-0 border-r dark:border-gray-600 dark:border-opacity-20">
          <header
            className={clsx(
              "mb-4 flex space-x-2 items-center justify-end bg-editor dark:bg-default w-full"
            )}
          >
            <IconButton
              aria-label="New note"
              variant="ghost"
              size="lg"
              className="dark:text-gray-400"
              onClick={addNote}
            >
              <IoCreateOutline />
            </IconButton>
            <IconButton
              aria-label="Delete note"
              variant="ghost"
              size="lg"
              className="dark:text-gray-400"
              onClick={deleteNote}
              disabled={!Boolean(state.selectedNote)}
            >
              <IoTrashOutline />
            </IconButton>
          </header>
          <div className="flex-grow">
            {notes.length === 0 && (
              <div className="h-full w-full flex items-center justify-center">
                <h5 className="text-gray-400 text-xl">No Notes</h5>
              </div>
            )}
            {notes.map((i) => (
              <NoteCard
                key={i.id}
                timestamp={i.updated ? i.updated.toDate() : undefined}
                id={i.id}
                title={i.title}
                lineText={i.lineText}
              />
            ))}
          </div>
        </div>
        {state.selectedNote &&
          userId !== "" &&
          state.selectedPath &&
          folderId && <RichEditorContainer path={getBasePath()} />}
      </div>
    );
  }
};

interface NoteCardProps {
  id: string;
  timestamp?: string;
  title?: string;
  lineText?: string;
}
const NoteCard: React.FC<NoteCardProps> = ({
  timestamp,
  title,
  lineText,
  id,
}) => {
  const activeClass = "bg-primary-300 dark:bg-primary-300 dark:text-default";
  const { state, update } = useNotesContext();
  const active = state.selectedNote === id;
  const handleClick = () => {
    update("selectedNote", id);
  };

  return (
    <div
      className={mergeClasses(
        clsx(
          "w-full rounded-md py-3 px-6 cursor-pointer transition-all",
          active && activeClass
        )
      )}
      onClick={handleClick}
    >
      <h6 className="line-clamp-1 font-bold text-sm">{title || "New text"}</h6>
      <div className="flex space-x-3 items-center">
        <Timestamp className="text-xs" date={timestamp} />
        <span
          className={clsx(
            "line-clamp-1 text-xs text-text-secondary",
            active && "dark:text-default"
          )}
        >
          {lineText || "No additional text"}
        </span>
      </div>
    </div>
  );
};
