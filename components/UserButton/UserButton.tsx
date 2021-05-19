import { AuthUserContext } from "next-firebase-auth";
import { useTheme } from "next-themes";
import { Menu, Transition, Switch } from "@headlessui/react";
import { Fragment, useState } from "react";
import { MenuButton, MenuItems } from "../StyledMenu";

interface UserButtonProps {
  user: AuthUserContext;
}

export const UserButton: React.FC<UserButtonProps> = ({ user }) => {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(theme === "dark");
  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setEnabled((prevState) => !prevState);
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <MenuButton>
              <span className="rounded-full relative flex-shrink-0 align-top w-4 h-4 border-0">
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full select-none"
                  draggable="false"
                  role="avatar"
                />
              </span>
              <span className="line-clamp-1 mx-2 text-sm">
                {user.displayName}
              </span>
            </MenuButton>
          </div>
          <MenuItems open={open}>
            <div className="px-1 py-1 ">
              <div
                className={`group flex rounded-md items-center justify-between w-full px-2 py-2 text-sm`}
              >
                Enable Dark Mode
                <Switch
                  checked={enabled}
                  onChange={handleToggle}
                  className={`${
                    enabled
                      ? "bg-indigo-400 dark:bg-indigo-300"
                      : "bg-gray-300 dark:bg-gray-600"
                  }
                            relative inline-flex flex-shrink-0 h-[20px] w-[36px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span className="sr-only">Toggle theme</span>
                  <span
                    aria-hidden="true"
                    className={`${enabled ? "translate-x-4" : "translate-x-0"}
                              pointer-events-none inline-block h-[16px] w-[16px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                  />
                </Switch>
              </div>
            </div>

            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-300 dark:bg-gray-600 bg-opacity-40" : ""
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={user.signOut}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </MenuItems>
        </>
      )}
    </Menu>
  );
};

export default UserButton;
