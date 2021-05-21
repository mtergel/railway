import { Popover } from "@headlessui/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { IconButton } from "../Button";
import { IoTextOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { ImBold, ImItalic, ImStrikethrough } from "react-icons/im";
import { memo } from "react";
import clsx from "clsx";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

export const RichEditor = () => {
  // const NewHardbreak = HardBreak.extend({
  //   addKeyboardShortcuts() {
  //     return {
  //       // ↓ your new keyboard shortcut
  //       Enter: () => this.editor.commands.setHardBreak(),
  //     };
  //   },
  // });

  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem],
    content: `
    <h2>
      Hi there,
    </h2>
    <p>
      this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    </p>
    <pre><code class="language-css">body {
    display: none;
  }</code></pre>
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
  `,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-dark prose-sm sm:prose lg:prose-lg xl:prose-xl m-5 focus:outline-none",
      },
    },
    autofocus: true,
  });

  return (
    <div className="flex flex-col min-h-0 min-w-0 h-screen bg-editor">
      <header
        className={clsx(
          "px-4 py-2 bg-editor dark:bg-default hover:shadow-sm w-full transition-shadow"
        )}
      >
        {editor && (
          <div>
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
                    onClick={() =>
                      editor.chain().focus().toggleCodeBlock().run()
                    }
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

            <IconButton
              aria-label="Checklist"
              size="lg"
              variant="ghost"
              className="dark:text-gray-400"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
            >
              <IoCheckmarkCircleOutline />
            </IconButton>
          </div>
        )}
      </header>
      <div className="flex-1 overflow-y-auto flex">
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
