import {
  IoFolderOutline,
  IoEllipsisHorizontalCircleSharp,
  IoChevronForwardOutline,
  IoChevronDownOutline,
  IoWarningOutline,
} from "react-icons/io5";
import clsx from "clsx";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Button } from "../Button";
import { useNotesContext } from "../Context/NotesContext";
import { firebaseClient } from "../../firebaseClient";
import { useDisclosure } from "../../lib/useDisclosure";
import { useAuthUser } from "next-firebase-auth";

interface FolderProps {
  id: string;
  count: number | string;
  title: string;
  isDeletable?: boolean;
  path: string;
  fbref: firebaseClient.firestore.CollectionReference<firebaseClient.firestore.DocumentData>;
}

const activeClass =
  "bg-primary-400 dark:bg-primary-300 text-white dark:text-gray-800";

export const FolderItem: React.FC<FolderProps> = ({
  id,
  title,
  count,
  isDeletable,
  fbref,
  path,
}) => {
  const { state, update, setLoading, loading } = useNotesContext();
  const AuthUser = useAuthUser();
  const folderArr = state.selectedPath ? state.selectedPath.split("/") : [];
  const lastFolderInPath = folderArr[folderArr.length - 1];
  const [folders, setFolders] = useState([]);
  const _ref = fbref.doc(id).collection("folders");

  useEffect(() => {
    if (folderArr.includes(id)) {
      open();
    }
    const unsubscribe = _ref.orderBy("order").onSnapshot((snap) => {
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

  const handleOnClick = () => {
    update("selectedPath", path + "/" + id);
    update("selectedNote", null);
  };

  const { open, isOpen, close, toggle } = useDisclosure();
  const [deleteModal, setDeleteModal] = useState(false);
  const handleOpen = () => {
    setDeleteModal(true);
  };
  const handleClose = () => {
    setDeleteModal(false);
  };

  const userRef = firebaseClient
    .firestore()
    .collection("users")
    .doc(AuthUser.id);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await fbref.doc(id).delete();

      const { folderNames } = (await userRef.get()).data();
      if (folderNames) {
        // const updatedFolderNames = folderNames.filter((i) => i !== )
        let newFolderNames: string[] = folderNames;
        for (let i = newFolderNames.length - 1; i >= 0; i--) {
          if (newFolderNames[i] === title) {
            newFolderNames.splice(i, 1);
            break;
          }
        }
        await userRef.update({
          folderNames: newFolderNames,
        });
      }
      if (folderArr.includes(id)) {
        update("selectedNote", null);
        update("selectedPath", null);
      }
      setLoading(false);
    } catch (error) {}
  };

  // const handeAddFolder = async (name: string) => {
  //   console.log("AAA: ", name);
  //   try {
  //     const userData = (await userRef.get()).data();
  //     if (userData.folderNames.includes(name)) {
  //       console.log("Sorry, folder name exists");
  //       addToast("Name taken", {
  //         appearance: "warning",
  //       });
  //       return;
  //     } else {
  //       // check if current subcollection e.g (folder) has
  //       // a subcollection

  //       if ((await _ref.limit(1).get()).empty) {
  //         console.log("NO SUBCOLLECTION CREATE FOLDERS");
  //       } else {
  //         console.log("ADD IT TO FOLDERS");
  //       }

  //       // if so
  //       // add to it to that
  //       //  else
  //       // create new subcollection
  //       // and add it to that
  //     }
  //   } catch (error) {}
  // };

  return (
    <div>
      <div className="flex flex-col">
        <div
          className={clsx(
            "flex items-center justify-between text-sm py-1 px-2 rounded-md group transition-all cursor-pointer",
            lastFolderInPath === id && activeClass
          )}
          onClick={handleOnClick}
        >
          <div className="flex items-center">
            <div className={"text-base w-5 h-4 overflow-hidden"}>
              {folders.length > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                >
                  {isOpen ? (
                    <IoChevronDownOutline />
                  ) : (
                    <IoChevronForwardOutline />
                  )}
                </span>
              )}
            </div>
            <div className="text-base">
              <IoFolderOutline />
            </div>
            <span className="ml-2 text-sm line-clamp-1">{title}</span>
          </div>
          <div className="flex items-center justify-between">
            {title !== "Notes" && (
              <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                  <>
                    <div className="flex items-center justify-center">
                      <Menu.Button
                        disabled={loading}
                        className="transition-opacity opacity-0 group-hover:opacity-100 h-full inline-flex justify-center items-center rounded-full bg-gray-300 bg-opacity-0 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                      >
                        <IoEllipsisHorizontalCircleSharp fontSize={16} />
                      </Menu.Button>
                    </div>

                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-50 left-0 w-24 mt-2 origin-top-right bg-paper rounded-md border dark:border-gray-600 border-opacity-40 border-gray-200　shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-text-primary">
                        {isDeletable && (
                          <div className="px-1 py-1">
                            <Menu.Item
                              as={Button}
                              size="sm"
                              variant="ghost"
                              isFullWidth
                              className="text-xs font-normal"
                              onClick={handleOpen}
                            >
                              Delete
                            </Menu.Item>
                          </div>
                        )}
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            )}

            <span className="ml-2">{count}</span>
          </div>
        </div>
      </div>
      {folders.length > 0 && (
        <Transition
          show={isOpen}
          enter="transition-all duration-75"
          enterFrom="opacity-0 max-h-0"
          enterTo="opacity-100 max-h-400"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 max-h-400"
          leaveTo="opacity-0 nax-h-0"
        >
          <div className="pl-4">
            {folders.map((folder) => (
              <FolderItem
                title={folder.title}
                id={folder.id}
                count={folder.count}
                key={folder.id}
                isDeletable={folder.isDeletable}
                fbref={_ref}
                path={path + "/" + id}
              />
            ))}
          </div>
        </Transition>
      )}
      <Transition appear show={deleteModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={close}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur-sm" />
            </Transition.Child>

            <div className="inline-block align-middle mt-12">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="p-4 inline-flex flex-col items-center justify-center w-full max-w-xs transition-all transform bg-paper shadow-sm rounded-2xl">
                  <span className="mb-4">
                    <IoWarningOutline className="text-3xl text-red-400" />
                  </span>

                  <Dialog.Title as="h3" className="text-md font-medium mb-1">
                    Are you sure you want to delete this folder?
                  </Dialog.Title>
                  <div className="mt-2 my-6">
                    <p className="text-xs text-center">
                      All notes and any subfolders will be deleted.
                    </p>
                  </div>

                  <div className="flex w-full space-x-4">
                    <Button
                      isFullWidth
                      onClick={handleClose}
                      className="ring-offset-paper"
                    >
                      Cancel
                    </Button>
                    <Button
                      isFullWidth
                      color="primary"
                      className="ring-offset-paper"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
export default FolderItem;
