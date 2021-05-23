import { Button, UserButton } from "../components";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { IoAddCircleOutline } from "react-icons/io5";

import FolderItem from "../components/Folders/FolderItem";
import { useEffect, useState, Fragment, useRef } from "react";
import { firebaseClient } from "../firebaseClient";
import { useDisclosure } from "../lib/useDisclosure";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import { useNotesContext } from "../components/Context/NotesContext";
import { NoteGrid } from "../components/NoteGrid/NoteGrid";
import { MetroSpinner } from "react-spinners-kit";

const Home = () => {
  const AuthUser = useAuthUser();
  const { addToast } = useToasts();
  const [folders, setFolders] = useState([]);
  const { state, loading, backgroundUpdate } = useNotesContext();
  const userRef = firebaseClient
    .firestore()
    .collection("users")
    .doc(AuthUser.id);
  const ref = firebaseClient
    .firestore()
    .collection("users")
    .doc(AuthUser.id)
    .collection("folders");

  useEffect(() => {
    const unsubscribe = ref.orderBy("order").onSnapshot((snap) => {
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

  const addNewFolder = async (name: string) => {
    try {
      const userPromise = await userRef.get();
      const userData = userPromise.data();

      if (userData.folderNames.includes(name)) {
        console.log("Sorry, folder name exists");
        addToast("Name taken", {
          appearance: "warning",
        });
        return;
      } else {
        // we create the folder
        await ref.add({
          title: name,
          count: 0,
          order: userData.lastFolderOrder + 100,
          isDeletable: true,
        });
        // switch the selected folder path in context
        // TODO

        // Update the user info
        await userRef.update({
          folderNames: userData.folderNames.concat(name),
          lastFolderOrder: userData.lastFolderOrder + 100,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex">
        <aside className="w-300 relative">
          {loading && (
            <div className="z-50 absolute top-0 left-0 right-0 bottom-0 w-full h-full backdrop-filter backdrop-blur-sm flex items-center justify-center">
              <MetroSpinner />
            </div>
          )}

          <div className="bg-paper py-2 px-4 space-y-4 flex flex-col h-screen sticky top-0">
            <div className="flex items-center space-x-2 justify-between">
              <UserButton user={AuthUser} />
              {backgroundUpdate && (
                <span>
                  <MetroSpinner size={24} />
                </span>
              )}
            </div>
            <div className="flex-grow">
              <div className="text-xs text-text-secondary mb-2">Folders</div>
              {folders.map((folder) => (
                <FolderItem
                  title={folder.title}
                  id={folder.id}
                  count={folder.count}
                  key={folder.id}
                  isDeletable={folder.isDeletable}
                  fbref={ref}
                  path={""}
                />
              ))}
            </div>
            <NewFolderButton onClick={addNewFolder} disabled={loading} />
          </div>
        </aside>
        <main className="flex-grow flex flex-col">
          <NoteGrid userId={AuthUser.id} />
        </main>
      </div>
    </>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

interface NewFolderButtonProps {
  onClick: (name: string) => Promise<void>;
  disabled?: boolean;
}
const NewFolderButton: React.FC<NewFolderButtonProps> = ({
  onClick,
  disabled,
}) => {
  const { isOpen, open, close } = useDisclosure();
  const cancelButtonRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      title: "New folder",
    },
    resolver: undefined,
    context: undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: false,
  });

  const onSubmit = async ({ title }) => {
    try {
      await onClick(title);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        variant="ghost"
        leftIcon={<IoAddCircleOutline />}
        onClick={open}
        isLoading={isSubmitting}
        disabled={disabled}
      >
        New folder
      </Button>
      {/* NEXT.JS 10.2 is breaking modals/react-modal */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={isOpen}
          onClose={close}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 dark:bg-opacity-40 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-paper rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                <div className="bg-default px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="pt-4 pb-6">
                      <input
                        type="text"
                        name="title"
                        placeholder="Folder name"
                        className="h-10 w-full px-2 transition-all focus:outline-none ring-2 ring-offset-2 ring-offset-default rounded-sm"
                        {...register("title", { required: true })}
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="solid"
                        onClick={close}
                        className="ring-offset-default"
                        disabled={isSubmitting}
                      >
                        Close
                      </Button>
                      <Button
                        variant="solid"
                        color="primary"
                        onClick={close}
                        className="ring-offset-default"
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        Create
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
