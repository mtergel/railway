import {
  IoFolderOutline,
  IoEllipsisHorizontalCircleSharp,
} from "react-icons/io5";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Button } from "../Button";
import { useNotesContext } from "../Context/NotesContext";
import { firebaseClient } from "../../firebaseClient";

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
  const { state, update } = useNotesContext();
  const folderArr = state.selectedPath ? state.selectedPath.split("/") : [];
  const lastFolderInPath = folderArr[folderArr.length - 1];
  const [folders, setFolders] = useState([]);
  const _ref = fbref.doc(id).collection("folders");
  useEffect(() => {
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
            <div className="text-base">
              <IoFolderOutline />
            </div>
            <span className="ml-2 text-sm line-clamp-1">{title}</span>
          </div>
          <div className="flex items-center justify-between">
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <div className="flex items-center justify-center">
                    <Menu.Button className="transition-opacity opacity-0 group-hover:opacity-100 h-full inline-flex justify-center items-center rounded-full bg-gray-300 bg-opacity-0 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      <IoEllipsisHorizontalCircleSharp />
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
                          >
                            Delete
                          </Menu.Item>
                        </div>
                      )}

                      <div className="px-1 py-1">
                        <Menu.Item
                          as={Button}
                          size="sm"
                          variant="ghost"
                          isFullWidth
                          className="text-xs font-normal"
                        >
                          New folder
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
            <span className="ml-2">{count}</span>
          </div>
        </div>
      </div>
      <div className="ml-2">
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
    </div>
  );
};

export default FolderItem;
