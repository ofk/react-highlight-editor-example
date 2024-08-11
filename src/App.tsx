import { BubbleMenu, EditorProvider, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const content = '<p>Hello World!</p>';

const extensions = [StarterKit];

export function App(): React.ReactElement {
  return (
    <EditorProvider content={content} extensions={extensions}>
      <FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={null}>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  );
}
