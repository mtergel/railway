import { Menu, Transition, Switch } from "@headlessui/react";
import { Fragment } from "react";

export const MenuButton: React.FC<{}> = ({ children }) => {
  return (
    <Menu.Button className="inline-flex justify-center items-center w-full px-2 py-1 text-sm font-medium rounded-full bg-gray-300 bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
      {children}
    </Menu.Button>
  );
};

interface MenuItemsProps {
  open: boolean;
}
export const MenuItems: React.FC<MenuItemsProps> = ({ open, children }) => {
  return (
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
      <Menu.Items className="absolute z-50 left-0 w-56 mt-2 origin-top-right bg-paper divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {children}
      </Menu.Items>
    </Transition>
  );
};
