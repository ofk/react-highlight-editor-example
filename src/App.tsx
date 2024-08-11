import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const content = '<p>Hello World!</p>';

const extensions = [
  // https://tiptap.dev/docs/editor/extensions/functionality/starterkit
  // The starter-kit only enables the following extensions:
  // - Nodes: Document, Paragraph, Text, HardBreak
  // - Extensions: Dropcursor, Gapcursor, History
  StarterKit.configure({
    blockquote: false,
    bold: false,
    bulletList: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    italic: false,
    listItem: false,
    orderedList: false,
    strike: false,
  }),
];

export function App(): React.ReactElement {
  return <EditorProvider content={content} extensions={extensions} />;
}
