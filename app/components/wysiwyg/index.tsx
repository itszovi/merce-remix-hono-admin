import Mention from "@tiptap/extension-mention";
import suggestion from "./suggestion";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "~/lib/classnames";
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListBulletIcon,
} from "@radix-ui/react-icons";
import { forwardRef, useRef } from "react";
import { generateHTML } from "@tiptap/react";

interface WysiwygEditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex justify-between gap-x-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          editor.isActive("bold") ? "is-active" : "",
          "flex p-0.5 hover:bg-slate-100 rounded-md group"
        )}
      >
        <FontBoldIcon
          name="font-bold"
          className="text-zinc-500 group-hover:text-zinc-700"
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          editor.isActive("italic") ? "is-active" : "",
          "flex p-0.5 hover:bg-slate-100 rounded-md group"
        )}
      >
        <FontItalicIcon
          name="font-italic"
          className="text-zinc-500 group-hover:text-zinc-700"
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={cn(
          editor.isActive("underline") ? "is-active" : "",
          "flex p-0.5 hover:bg-slate-100 rounded-md group"
        )}
      >
        <UnderlineIcon
          name="underline"
          className="text-zinc-500 group-hover:text-zinc-700"
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          editor.isActive("strike") ? "is-active" : "",
          "flex p-0.5 hover:bg-slate-100 rounded-md group"
        )}
      >
        <StrikethroughIcon
          name="strikethrough"
          className="text-zinc-500 group-hover:text-zinc-700"
        />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={cn(
          editor.isActive("bullet-list") ? "is-active" : "",
          "flex p-0.5 hover:bg-slate-100 rounded-md group"
        )}
      >
        <ListBulletIcon
          name="list-bullet"
          className="text-zinc-500 group-hover:text-zinc-700"
        />
      </button>
    </div>
  );
};

const WysiwygEditor = forwardRef<HTMLTextAreaElement, WysiwygEditorProps>(
  ({ className, ...props }, ref) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        Mention.configure({
          HTMLAttributes: {
            class:
              "mention font-bold text-indigo-600 cursor-pointer bg-violet-100 rounded-md p-0.5",
          },
          suggestion,
        }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        // TextStyle.configure({ types: [ListItem.name] }),
        Underline,
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
          },
        }),
      ],
      content: (props.defaultValue as string | null) ?? ``,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl dark:text-white mx-auto focus:outline-none min-h-32 px-2 py-2",
        },
      },
      onUpdate: ({ editor }) => {
        if (textAreaRef?.current) {
          console.log(editor.getHTML());
          textAreaRef.current.value = editor.getHTML();
          props.value = editor.getHTML();
        }
      },
    });

    if (!editor) {
      return null;
    }

    return (
      <div
        className={cn(
          "rounded-md border dark:border-zinc-700 px-2 pb-2 text-sm",
          className
        )}
      >
        <EditorContent editor={editor} />
        <div className="flex justify-between gap-x-1">
          <MenuBar editor={editor} />
          {/* <button className="flex items-center justify-center px-4 py-1 transition-colors ease-in-out rounded-md min-w-12 gap-x-2 bg-violet-100 hover:bg-violet-50">
            <span className="text-sm font-medium text-indigo-600">Comment</span>
            <Icon name="paper-plane" size="sm" className="text-indigo-600" />
          </button> */}
        </div>
        <textarea
          // onChange={(e) => {
          //   editor.commands.setContent(e.target.value)
          // }}
          {...props}
          id={props.id}
          name={props.name}
          className="hidden"
          ref={textAreaRef}
        />
      </div>
    );
  }
);
WysiwygEditor.displayName = "WysiwygEditor";

export { WysiwygEditor };
