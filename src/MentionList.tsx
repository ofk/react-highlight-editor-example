import type { SuggestionKeyDownProps } from '@tiptap/suggestion';

import React, { useEffect, useImperativeHandle, useState } from 'react';

export const MentionList = React.forwardRef<
  {
    onKeyDown: (props: SuggestionKeyDownProps) => boolean;
  },
  {
    command: (props: { id: string }) => void;
    items: string[];
  }
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number): void => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = (): void => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = (): void => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = (): void => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }): boolean => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="dropdown-menu">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={index === selectedIndex ? 'is-selected' : ''}
            onClick={() => {
              selectItem(index);
            }}
            type="button"
          >
            {item}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});
