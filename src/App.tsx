import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Highlight } from './highlight';
// import { Plaintext } from './plaintext';

const content =
  '<p>Hello World!</p>' +
  `<p><span data-type="highlight" data-id="Jennifer Grey"></span> Would you mind to share what you’ve been working on lately? We fear not much happened since Dirty Dancing. <p><span data-type="highlight" data-id="Winona Ryder"></span> <span data-type="highlight" data-id="Axl Rose"></span> Let’s go through your most important points quickly.</p>`;

const editorExtensions = [
  // Plaintext.configure({
  //   transformCopiedText: true,
  //   transformPastedText: true,
  // }),
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
  Highlight.configure({
    suggestion: {
      items: () => [
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
      ],
    },
  }),
];

export function App(): React.ReactElement {
  const editor = useEditor({ content, extensions: editorExtensions });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
