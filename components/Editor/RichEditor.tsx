import { Popover, Transition } from "@headlessui/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { IconButton } from "../Button";
import { IoTextOutline } from "react-icons/io5";
import { ImBold, ImItalic, ImStrikethrough } from "react-icons/im";
import { memo, useEffect } from "react";
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
        editor.chain().focus().toggleHeading({ level: 1 }).run();
      }
    }
  }, [content]);

  return (
    <div className="flex flex-col min-h-0 min-w-0 h-full bg-editor">
      <div className="px-4 py-2 bg-editor hover:shadow-md w-full transition-shadow hover:bg-default">
        {editor && (
          <Popover as="div" className="relative inline-block text-left">
            <div>
              <Popover.Button
                as={IconButton}
                aria-label="Typography"
                size="lg"
                variant="ghost"
                className="dark:text-gray-400"
              >
                <IoTextOutline />
              </Popover.Button>
            </div>

            <Popover.Panel className="absolute z-50 left-0 w-48 mt-2 origin-top-right bg-paper border dark:border-gray-600 border-opacity-40 border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-2 flex justify-around w-full">
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
              <hr className="my-1 border-default" />
              <div className="p-2 space-y-1">
                <TypographyItem
                  label="Title"
                  labelClass="text-lg font-bold"
                  active={editor.isActive("heading", { level: 1 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                />
                <TypographyItem
                  label="Heading"
                  labelClass="text-md font-bold"
                  active={editor.isActive("heading", { level: 2 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                />
                <TypographyItem
                  label="Subheading"
                  labelClass="text-sm font-bold"
                  active={editor.isActive("heading", { level: 3 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                />
                <TypographyItem
                  label="Body"
                  labelClass="text-sm"
                  active={editor.isActive("paragraph")}
                  onClick={() => editor.chain().focus().setParagraph().run()}
                />
                <TypographyItem
                  label="&#8226; Bullet List"
                  labelClass="text-sm"
                  active={editor.isActive("bulletList")}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                />
                <TypographyItem
                  label="1. Numbered List"
                  labelClass="text-sm"
                  active={editor.isActive("orderedList")}
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                />
                <TypographyItem
                  label="Code"
                  labelClass="text-sm"
                  active={editor.isActive("codeBlock")}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                />
                <TypographyItem
                  label="Block quote"
                  labelClass="text-sm"
                  active={editor.isActive("blockquote")}
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                />
              </div>
            </Popover.Panel>
          </Popover>
        )}
      </div>
      <div className="flex-grow flex">
        <EditorContent editor={editor} className="m-4 flex-grow" />
      </div>
    </div>
  );
};

interface TypographyItemProps {
  label: string;
  labelClass?: string;
  active: boolean;
  onClick: () => void;
}
const TypographyItem: React.FC<TypographyItemProps> = memo(
  ({ active, label, onClick, labelClass }) => {
    return (
      <div>
        <button
          type="button"
          className="relative flex rounded-md justify-start items-center w-full px-1 hover:bg-primary-300 dark:hover:bg-primary-300 dark:hover:text-default"
          onClick={onClick}
        >
          <span
            className={clsx(
              active && "opacity-100",
              "opacity-0 mx-2 transition-opacity"
            )}
          >
            &#10003;
          </span>
          <span className={labelClass}>{label} </span>
        </button>
      </div>
    );
  }
);
export default RichEditor;
