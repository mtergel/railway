import { Popover, Transition } from "@headlessui/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { IconButton } from "../Button";
import { IoTextOutline } from "react-icons/io5";
import { ImBold, ImItalic, ImStrikethrough } from "react-icons/im";
import { useEffect } from "react";
import clsx from "clsx";

export const RichEditor = () => {
  const content = null;

  const editor = useEditor({
    extensions: [StarterKit],
    content,
  });

  useEffect(() => {
    if (content) {
    } else {
      // new document
      if (editor) {
        editor
          .chain()
          .toggleHeading({
            level: 1,
          })
          .run();
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-0 min-w-0 h-full bg-editor">
      <div className="px-8 py-4 bg-editor hover:shadow-md w-full transition-all hover:bg-default">
        {editor && (
          <Popover as="div" className="relative inline-block text-left">
            <div>
              <Popover.Button
                as={IconButton}
                aria-label="Typography"
                variant="ghost"
                className="dark:text-gray-400"
              >
                <IoTextOutline />
              </Popover.Button>
            </div>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute z-50 left-0 w-32 mt-2 origin-top-right bg-paper divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-2 flex justify-around w-full ">
                  <IconButton
                    variant={editor.isActive("bold") ? "solid" : "ghost"}
                    aria-label="bold"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    color={editor.isActive("bold") ? "primary" : undefined}
                  >
                    <ImBold />
                  </IconButton>
                  <IconButton
                    variant={editor.isActive("italic") ? "solid" : "ghost"}
                    aria-label="italic"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    color={editor.isActive("italic") ? "primary" : undefined}
                  >
                    <ImItalic />
                  </IconButton>
                  <IconButton
                    variant={editor.isActive("strike") ? "solid" : "ghost"}
                    aria-label="strike"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    color={editor.isActive("strike") ? "primary" : undefined}
                  >
                    <ImStrikethrough />
                  </IconButton>
                </div>
                <button
                  type="button"
                  className={clsx(
                    "p-2 text-xl text-center",
                    editor.isActive("heading", { level: 1 }) && "text-red-300"
                  )}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                >
                  Title
                </button>
              </Popover.Panel>
            </Transition>
          </Popover>
        )}
      </div>
      <div className="flex-grow flex">
        <EditorContent editor={editor} className="m-4 flex-grow" />
      </div>
    </div>
  );
};

export default RichEditor;
