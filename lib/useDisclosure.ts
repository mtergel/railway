import { useCallback, useState } from "react";

export const useDisclosure = (isOpenDefault: boolean = false) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  return { isOpen, open, close, toggle, setIsOpen };
};
