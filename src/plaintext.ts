/* eslint-disable class-methods-use-this, max-classes-per-file, @typescript-eslint/explicit-function-return-type */
import type { Content, Editor } from '@tiptap/core';
import type { Fragment, Node, Slice } from '@tiptap/pm/model';

import { Extension, extensions } from '@tiptap/core';
import { DOMParser } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';

interface PlaintextOptions {
  transformCopiedText: boolean;
  transformPastedText: boolean;
}

interface PlaintextEditor extends Editor {
  options: {
    initialContent?: Editor['options']['content'];
  } & Editor['options'];
  storage: {
    plaintext: {
      getPlaintext: () => string;
      options: PlaintextOptions;
      parser: PlaintextParser;
      serializer: PlaintextSerializer;
    };
  } & Editor['storage'];
}

function elementFromString(value: unknown) {
  const wrappedValue = `<body>${String(value)}</body>`;
  return new window.DOMParser().parseFromString(wrappedValue, 'text/html').body;
}

class PlaintextParser {
  editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  parse(content: Content): Content {
    if (typeof content === 'string') {
      return `<p>${content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')}</p>`;
    }
    return content;
  }
}

class PlaintextRenderer {
  render(node: Node) {
    return node.type.inlineContent ? this.renderInline(node) : this.renderContent(node);
  }

  renderContent(parent: Fragment | Node) {
    const content: string[] = [];
    parent.forEach((node) => {
      content.push(this.render(node));
    });
    return content.join('\n');
  }

  renderInline(parent: Node) {
    const content: string[] = [];
    parent.forEach((node) => {
      content.push(node.type.name === 'hardBreak' ? '\n' : node.textContent);
    });
    return content.join('');
  }
}

class PlaintextSerializer {
  editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  serialize(content: Fragment | Node): string {
    return new PlaintextRenderer().renderContent(content);
  }
}

const PlaintextClipboard = Extension.create<PlaintextOptions>({
  addOptions() {
    return {
      transformCopiedText: false,
      transformPastedText: false,
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('plaintextClipboard'),
        props: {
          clipboardTextParser: (text, context, plainText) => {
            if (plainText || !this.options.transformPastedText) {
              return null as unknown as Slice;
            }
            const parsed = (this.editor as PlaintextEditor).storage.plaintext.parser.parse(text);
            return DOMParser.fromSchema(this.editor.schema).parseSlice(elementFromString(parsed), {
              context,
              preserveWhitespace: true,
            });
          },
          clipboardTextSerializer: (slice) => {
            if (!this.options.transformCopiedText) {
              return null as unknown as string;
            }
            return (this.editor as PlaintextEditor).storage.plaintext.serializer.serialize(
              slice.content,
            );
          },
        },
      }),
    ];
  },
  name: 'plaintextClipboard',
});

export const Plaintext = Extension.create<PlaintextOptions>({
  addCommands() {
    // @ts-expect-error :thinking_face:
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const commands = extensions.Commands.config.addCommands!();
    return {
      insertContentAt: (range, content, options) => (props) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        commands.insertContentAt!(
          range,
          (props.editor as PlaintextEditor).storage.plaintext.parser.parse(content),
          options,
        )(props),
      setContent: (content, emitUpdate, parseOptions) => (props) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        commands.setContent!(
          (props.editor as PlaintextEditor).storage.plaintext.parser.parse(content),
          emitUpdate,
          parseOptions,
        )(props),
    };
  },
  addExtensions() {
    return [
      PlaintextClipboard.configure({
        transformCopiedText: this.options.transformCopiedText,
        transformPastedText: this.options.transformPastedText,
      }),
    ];
  },
  addOptions() {
    return {
      transformCopiedText: false,
      transformPastedText: false,
    };
  },
  addStorage() {
    return {};
  },
  name: 'plaintext',
  onBeforeCreate() {
    const editor = this.editor as PlaintextEditor;
    editor.storage.plaintext = {
      getPlaintext: () => editor.storage.plaintext.serializer.serialize(this.editor.state.doc),
      options: { ...this.options },
      parser: new PlaintextParser(editor),
      serializer: new PlaintextSerializer(editor),
    };
    editor.options.initialContent = editor.options.content;
    editor.options.content = editor.storage.plaintext.parser.parse(editor.options.content);
  },
  onCreate() {
    const editor = this.editor as PlaintextEditor;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    editor.options.content = editor.options.initialContent!;
    delete editor.options.initialContent;
  },
  priority: 50,
});
