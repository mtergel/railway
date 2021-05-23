import { Popover } from "@headlessui/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { IconButton } from "../Button";
import { IoTextOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { ImBold, ImItalic, ImStrikethrough } from "react-icons/im";
import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useNotesContext } from "../Context/NotesContext";
import { firebaseClient } from "../../firebaseClient";
import debounce from "lodash/debounce";
import { MetroSpinner } from "react-spinners-kit";

interface RichEditorContainerProps {
  path: string;
}

interface RichEditorProps {
  path: string;
  contentData: firebaseClient.firestore.DocumentData;
}

export const RichEditorContainer: React.FC<RichEditorContainerProps> = ({
  path,
}) => {
  const [contentState, setContentState] =
    useState<firebaseClient.firestore.DocumentData | null>(null);
  const { state, backgroundUpdate } = useNotesContext();

  const getData = async () => {
    if (state.selectedNote) {
      try {
        const ref = firebaseClient
          .firestore()
          .collection(path)
          .doc(state.selectedNote);

        setContentState(null);
        setContentState((await ref.get()).data());
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [state.selectedNote, path]);

  if (contentState) {
    return <RichEditor contentData={contentState} path={path} />;
  } else {
    return (
      <div className="z-50 w-full h-full flex items-center justify-center">
        <MetroSpinner />
      </div>
    );
  }
};

export const RichEditor: React.FC<RichEditorProps> = ({
  path,
  contentData,
}) => {
  const { state, setBgUpdate } = useNotesContext();
  const delayedUpdate = debounce(
    async (content: string, title: string, lineText: string) => {
      if (state.selectedNote) {
        const ref = firebaseClient
          .firestore()
          .collection(path)
          .doc(state.selectedNote);
        setBgUpdate(true);
        console.log(content);
        await ref.update({
          content,
          title,
          lineText,
          updated: firebaseClient.firestore.FieldValue.serverTimestamp(),
        });
        setBgUpdate(false);
      }
    },
    300
  );

  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem],
    content: contentData.content,
    onUpdate: ({ editor }) =>
      delayedUpdate(
        editor.getHTML(),
        editor.state.doc.content.firstChild
          ? editor.state.doc.content.firstChild.textContent
          : "",
        editor.state.doc.childCount >= 1
          ? editor.state.doc.child(1).textContent
          : ""
      ),
    editorProps: {
      attributes: {
        class:
          "h-full prose dark:prose-dark prose-sm sm:prose lg:prose-lg xl:prose-xl mx-5 focus:outline-none",
      },
    },

    autofocus: "end",
  });

  return (
    <div className="flex flex-col min-h-0 min-w-0 h-screen bg-editor w-full">
      {editor && (
        <header className="px-4 py-2 space-x-2 bg-editor dark:bg-default hover:shadow-sm w-full transition-shadow">
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
                  active={editor.isActive("heading", { level: 2 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                />
                <TypographyItem
                  label="Heading"
                  labelClass="text-md font-bold"
                  active={editor.isActive("heading", { level: 3 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                />
                <TypographyItem
                  label="Subheading"
                  labelClass="text-sm font-bold"
                  active={editor.isActive("heading", { level: 4 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
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

          <IconButton
            aria-label="Checklist"
            size="lg"
            variant="ghost"
            className="dark:text-gray-400"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <IoCheckmarkCircleOutline />
          </IconButton>
        </header>
      )}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-center py-2 text-gray-400">
          <span className="text-xs">This document will auto save.</span>
        </div>
        <EditorContent editor={editor} className="flex-grow" />
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
