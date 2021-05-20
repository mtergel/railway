import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { useState, useRef, useEffect, Fragment } from "react";
import {
  IoTrashOutline,
  IoTextOutline,
  IoCreateOutline,
  IoCheckmarkCircleOutline,
  IoImagesOutline,
} from "react-icons/io5";
import { ImBold, ImItalic, ImUnderline, ImStrikethrough } from "react-icons/im";
import { IconButton } from "../Button";
import { Transition } from "@headlessui/react";

export const RichEditor = () => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef();

  useEffect(() => {
    setEditorState(EditorState.moveFocusToEnd(editorState));
  }, []);

  const applyStyle = (inlineStyle: string) => {
    const editorStateFocused = EditorState.forceSelection(
      editorState,
      editorState.getSelection()
    );

    setEditorState(
      RichUtils.toggleInlineStyle(editorStateFocused, inlineStyle)
    );
  };

  const toggleBold = (e) => {
    e.preventDefault();
    applyStyle("BOLD");
  };

  const toggleItalic = (e) => {
    e.preventDefault();
    applyStyle("ITALIC");
  };
  const toggleUnderline = (e) => {
    e.preventDefault();
    applyStyle("UNDERLINE");
  };
  const toggleStrike = (e) => {
    e.preventDefault();
    applyStyle("STRIKETHROUGH");
  };

  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    // @ts-ignore
    editorRef.current.focus();
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          close();
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div className="bg-editor h-full flex flex-col">
      <div className="bg-editor dark:bg-paper py-2 px-4 transition-shadow hover:shadow-sm">
        <div ref={wrapperRef} className="relative inline-block text-left">
          <IconButton
            aria-label="typography"
            variant="ghost"
            onClick={() => (isOpen ? close() : open())}
          >
            <IoTextOutline />
          </IconButton>
          <Transition
            show={isOpen}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute z-50 left-0 w-48 mt-2 origin-top-right bg-paper divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 flex items-center justify-around">
                <IconButton
                  as="span"
                  variant="ghost"
                  aria-label="bold"
                  size="sm"
                  onMouseDown={toggleBold}
                  onClick={(e) => {
                    close();
                  }}
                  color={
                    editorState.getCurrentInlineStyle().has("UNDERLINE")
                      ? "primary"
                      : undefined
                  }
                >
                  <ImBold />
                </IconButton>
                <IconButton
                  as="span"
                  variant="ghost"
                  aria-label="italic"
                  size="sm"
                  onMouseDown={toggleItalic}
                  onClick={(e) => {
                    close();
                  }}
                  color={
                    editorState.getCurrentInlineStyle().has("ITALIC")
                      ? "primary"
                      : undefined
                  }
                >
                  <ImItalic />
                </IconButton>
                <IconButton
                  as="span"
                  variant="ghost"
                  aria-label="underline"
                  size="sm"
                  onMouseDown={toggleUnderline}
                  onClick={(e) => {
                    close();
                  }}
                  color={
                    editorState.getCurrentInlineStyle().has("UNDERLINE")
                      ? "primary"
                      : undefined
                  }
                >
                  <ImUnderline />
                </IconButton>
                <IconButton
                  as="span"
                  variant="ghost"
                  aria-label="strikethrough"
                  size="sm"
                  onMouseDown={toggleStrike}
                  onClick={(e) => {
                    close();
                  }}
                  color={
                    editorState.getCurrentInlineStyle().has("STRIKETHROUGH")
                      ? "primary"
                      : undefined
                  }
                >
                  <ImStrikethrough />
                </IconButton>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <div className="py-2 px-4 flex-grow first:h-full">
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          preserveSelectionOnBlur
        />
      </div>
    </div>
  );
};

export default RichEditor;
