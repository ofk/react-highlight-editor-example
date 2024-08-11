import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Plaintext } from './plaintext';

const content = '<p>Hello World!</p>';

const editorExtensions = [
  Plaintext.configure({
    transformCopiedText: true,
    transformPastedText: true,
  }),
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
  const editor = useEditor({ content, extensions: editorExtensions });

  return (
    <div>
      <EditorContent editor={editor} />
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        editor?.storage.plaintext.getPlaintext()}
      </pre>
    </div>
  );
}
