import Mention from '@tiptap/extension-mention';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

import { suggestion } from './suggestion';

const content = `
  <p>Hi everyone! Don’t forget the daily stand up at 8 AM.</p>
  <p><span data-type="mention" data-id="b1.v1"></span> Would you mind to share what you’ve been working on lately? We fear not much happened since Dirty Dancing.
  <p><span data-type="mention" data-id="b2.v1"></span> <span data-type="mention" data-id="b3.v1"></span> Let’s go through your most important points quickly.</p>
  <p>I have a meeting with <span data-type="mention" data-id="v5.v1"></span> and don’t want to come late.</p>
  <p>– Thanks, your big boss</p>
`;

const items = [
  { id: 'b1.v1', label: 'Start#lorem' },
  { id: 'b1.v2', label: 'Start#ipsum' },
  { id: 'b2.v1', label: 'Block#string' },
  { id: 'b2.v2', label: 'Block#number' },
  { id: 'b2.v3', label: 'Block#boolean' },
  { id: 'b3.v1', label: 'Other#number' },
  { id: 'b3.v2', label: 'Other#string' },
  { id: 'b3.v3', label: 'Other#boolean' },
  { id: 'b4.v1', label: 'Finish#foo' },
  { id: 'b4.v2', label: 'Finish#bar' },
];

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
  Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    renderHTML({ node, options }) {
      console.log(node, this, options);
      return [
        'span',
        { 'data-type': 'mention', ...options.HTMLAttributes },
        `${node.attrs.label ?? node.attrs.id ?? ''}`,
      ];
    },
    suggestion,
  }),
];

export function App(): React.ReactElement {
  const editor = useEditor({ content, extensions });

  useEffect(() => {
    if (editor) {
      editor.storage.suggestionItems = items;
    }
  }, [editor]);

  return (
    <div>
      <EditorContent editor={editor} />
      <pre style={{ whiteSpace: 'pre-wrap' }}>{editor?.getHTML()}</pre>
    </div>
  );
}
