"use client";

type Props = {
  onEdit: (value: string) => unknown;
};

export const EditorComponent = ({ onEdit }: Props) => {
  return (
    <div className="flex flex-col h-[600px] bg-(--card-color) py-4 px-8 rounded-lg">
      <h2>Редактирование .md</h2>

      <textarea
        id="markdown-editor"
        onChange={(e) => onEdit(e.currentTarget.value)}
        className={[
          "flex-1 w-full p-4 resize-none backdrop-blur-sm rounded-lg font-mono",
          "ring-2 ring-(--mini-text-color)",
          "focus:outline-none focus:ring-2 focus:ring-(--foreground)",
        ].join(" ")}
        placeholder="Начните писать Markdown здесь..."
        spellCheck="false"
      />

      <div className="mt-2 text-xs text-(--mini-text-color) flex justify-between">
        <span>Изменения автоматически сохраняются в URL</span>
        <span>Ctrl+S для сохранения файла</span>
      </div>
    </div>
  );
};
