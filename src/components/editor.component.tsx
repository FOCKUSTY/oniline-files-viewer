"use client";

import type { RefObject, UIEvent } from "react";

type Props = {
  onEdit: (value: string) => unknown;
  content?: string;
  urlSynconizationEnabled: boolean;
  synchronousScrollEnabled: boolean;
  previewRef: RefObject<HTMLDivElement | null>;
};

export const EditorComponent = ({
  onEdit,
  urlSynconizationEnabled,
  content = "",
  previewRef,
  synchronousScrollEnabled,
}: Props) => {
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const handleScroll = (
    event: UIEvent<HTMLTextAreaElement, globalThis.UIEvent>,
  ) => {
    if (!previewRef.current) {
      return;
    }

    if (!synchronousScrollEnabled) {
      return;
    }

    const source = event.currentTarget;
    const target = previewRef.current;

    const scrollPercent =
      source.scrollTop / (source.scrollHeight - source.clientHeight);
    const targetScrollTop =
      scrollPercent * (target.scrollHeight - target.clientHeight);

    target.scrollTop = targetScrollTop;
  };

  return (
    <div className="flex flex-col h-[600px] bg-(--bg-card) py-4 px-8 rounded-lg">
      <h2>Редактирование .md</h2>

      <textarea
        id="markdown-editor"
        value={content}
        onChange={(e) => onEdit(e.currentTarget.value)}
        className={[
          "flex-1 w-full py-2 px-4 resize-none backdrop-blur-sm rounded-lg font-mono",
          "ring-2 ring-(--fg-mini-text)",
          "focus:outline-none focus:ring-2 focus:ring-(--fg-default)",
        ].join(" ")}
        placeholder="Начните писать Markdown здесь..."
        spellCheck="false"
        onScroll={handleScroll}
      />

      <div className="mt-2 text-xs text-(--fg-mini-text) flex justify-between">
        <span>
          Изменения {urlSynconizationEnabled ? "" : "не"} сохраняются в URL
        </span>
        <span>Символов: {content.length}</span>
        <span>Слов: {words.length}</span>
      </div>
    </div>
  );
};
