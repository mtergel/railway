import {
  IoFolderOutline,
  IoEllipsisHorizontalCircleSharp,
} from "react-icons/io5";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { MenuButton } from "../StyledMenu";
import { Fragment } from "react";

interface FolderProps {
  count: number | string;
  title: string;
  active?: boolean;
  isDeletable?: boolean;
}

const activeClass =
  "bg-primary-400 dark:bg-primary-300 text-white dark:text-gray-800";

export const FolderItem: React.FC<FolderProps> = ({
  title,
  count,
  active,
  isDeletable,
}) => {
  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          "flex items-center justify-between text-sm py-1 px-2 rounded-md group transition-all",
          active && activeClass
        )}
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
                  <Menu.Items className="absolute z-50 left-0 w-32 mt-2 origin-top-right bg-paper divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-text-primary">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-gray-300 dark:bg-gray-600 bg-opacity-40"
                                : ""
                            } group flex rounded-md items-center w-full px-2 py-1 text-sm`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>

                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-gray-300 dark:bg-gray-600 bg-opacity-40"
                                : ""
                            } group flex rounded-md items-center w-full px-2 py-1 text-sm`}
                          >
                            Logout
                          </button>
                        )}
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
  );
};

export default FolderItem;
