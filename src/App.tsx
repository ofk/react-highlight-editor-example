import Mention from '@tiptap/extension-mention';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

import { suggestion } from './suggestion';

const content = `
  <p>Hi everyone! Don’t forget the daily stand up at 8 AM.</p>
  <p><span data-type="mention" data-id="Jennifer Grey"></span> Would you mind to share what you’ve been working on lately? We fear not much happened since Dirty Dancing.
  <p><span data-type="mention" data-id="Winona Ryder"></span> <span data-type="mention" data-id="Axl Rose"></span> Let’s go through your most important points quickly.</p>
  <p>I have a meeting with <span data-type="mention" data-id="Christina Applegate"></span> and don’t want to come late.</p>
  <p>– Thanks, your big boss</p>
`;

const items = [
  'Lea Thompson',
  'Cyndi Lauper',
  'Tom Cruise',
  'Madonna',
  'Jerry Hall',
  'Joan Collins',
  'Winona Ryder',
  'Christina Applegate',
  'Alyssa Milano',
  'Molly Ringwald',
  'Ally Sheedy',
  'Debbie Harry',
  'Olivia Newton-John',
  'Elton John',
  'Michael J. Fox',
  'Axl Rose',
  'Emilio Estevez',
  'Ralph Macchio',
  'Rob Lowe',
  'Jennifer Grey',
  'Mickey Rourke',
  'John Cusack',
  'Matthew Broderick',
  'Justine Bateman',
  'Lisa Bonet',
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
