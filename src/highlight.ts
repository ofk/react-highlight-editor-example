/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DOMOutputSpec, Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { SuggestionOptions } from '@tiptap/suggestion';

import { Node, mergeAttributes } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';

export interface HighlightNodeAttrs {
  id: null | string;
  label?: null | string;
}

export interface HighlightOptions<
  SuggestionItem = unknown,
  Attrs extends object = HighlightNodeAttrs,
> {
  HTMLAttributes: object;

  deleteTriggerWithBackspace: boolean;

  renderHTML: (props: {
    node: ProseMirrorNode;
    options: HighlightOptions<SuggestionItem, Attrs>;
  }) => DOMOutputSpec;

  renderText: (props: {
    node: ProseMirrorNode;
    options: HighlightOptions<SuggestionItem, Attrs>;
  }) => string;

  suggestion: Omit<SuggestionOptions<SuggestionItem, Attrs>, 'editor'>;
}

export const HighlightPluginKey = new PluginKey('highlight');

export const Highlight = Node.create<HighlightOptions>({
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            'data-id': attributes.id as string,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            'data-label': attributes.label as string,
          };
        },
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ state, tr }) => {
          let isHighlight = false;
          const { selection } = state;
          const { anchor, empty } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isHighlight = true;
              tr.insertText(
                this.options.deleteTriggerWithBackspace ? '' : (this.options.suggestion.char ?? ''),
                pos,
                pos + node.nodeSize,
              );

              return false;
            }
            return undefined;
          });

          return isHighlight;
        }),
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {},
      deleteTriggerWithBackspace: false,
      renderHTML({ node, options }) {
        return [
          'span',
          mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
          `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
        ];
      },
      renderText({ node, options }) {
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
      },
      suggestion: {
        allow: ({ range, state }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);

          return allow;
        },
        char: '@',
        command: ({ editor, props, range }) => {
          const { nodeAfter } = editor.view.state.selection.$to;
          const overrideSpace = nodeAfter?.text?.startsWith(' ');

          if (overrideSpace) {
            // eslint-disable-next-line no-param-reassign
            range.to += 1;
          }

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                attrs: props,
                type: this.name,
              },
              {
                text: ' ',
                type: 'text',
              },
            ])
            .run();

          window.getSelection()?.collapseToEnd();
        },
        pluginKey: HighlightPluginKey,
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },

  atom: true,

  group: 'inline',

  inline: true,

  name: 'highlight',

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const mergedOptions = { ...this.options };

    mergedOptions.HTMLAttributes = mergeAttributes(
      { 'data-type': this.name },
      this.options.HTMLAttributes,
      HTMLAttributes,
    );
    const html = this.options.renderHTML({
      node,
      options: mergedOptions,
    });

    if (typeof html === 'string') {
      return [
        'span',
        mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
        html,
      ];
    }
    return html;
  },

  renderText({ node }) {
    return this.options.renderText({
      node,
      options: this.options,
    });
  },

  selectable: false,
});
