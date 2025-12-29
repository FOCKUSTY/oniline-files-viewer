"use client";

type Props = {
  onEdit: (value: string) => unknown;
  content?: string;
  urlSynconizationEnabled: boolean;
};

export const EditorComponent = ({ onEdit, urlSynconizationEnabled, content = "" }: Props) => {
  const words = content.trim().split(/\s+/).filter(word => word.length > 0)

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
      />

      <div className="mt-2 text-xs text-(--fg-mini-text) flex justify-between">
        <span>Изменения {urlSynconizationEnabled ? "" : "не"} сохраняются в URL</span>
        <span>Символов: {content.length}</span>
        <span>Слов: {words.length}</span>
      </div>
    </div>
  );
};
