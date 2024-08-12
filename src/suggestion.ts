import type { MentionOptions } from '@tiptap/extension-mention';
import type { SuggestionKeyDownProps } from '@tiptap/suggestion';
import type { GetReferenceClientRect } from 'tippy.js';

import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

import { MentionList } from './MentionList.jsx';

export const suggestion: MentionOptions['suggestion'] = {
  items: ({ editor, query }) =>
    ((editor.storage.suggestionItems ?? []) as string[])
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5),
  render: () => {
    let component: ReactRenderer;
    let popup: ReturnType<typeof tippy>;

    return {
      onExit(): void {
        popup[0].destroy();
        component.destroy();
      },

      onKeyDown(props): boolean {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        if (!component.ref) {
          return false;
        }

        return (
          component.ref as {
            onKeyDown: (props: SuggestionKeyDownProps) => boolean;
          }
        ).onKeyDown(props);
      },

      onStart(props): void {
        component = new ReactRenderer(MentionList, {
          editor: props.editor,
          props,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          appendTo: () => document.body,
          content: component.element,
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          interactive: true,
          placement: 'bottom-start',
          showOnCreate: true,
          trigger: 'manual',
        });
      },

      onUpdate(props): void {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        });
      },
    };
  },
};
