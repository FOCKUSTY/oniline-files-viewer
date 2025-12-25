"use client";

type Props = {
  onEdit: (value: string) => unknown;
  updateUrl: (value: string) => unknown;
  content: string;
};

export const EditorComponent = ({ onEdit, updateUrl, content }: Props) => {
  return (
    <div className="flex flex-col h-[600px] bg-(--bg-card) py-4 px-8 rounded-lg">
      <h2>Редактирование .md</h2>

      <textarea
        id="markdown-editor"
        onChange={(e) => {
          const { value } = e.currentTarget; 
          onEdit(value);
          updateUrl(value);
        }}
        value={content}
        className={[
          "flex-1 w-full p-4 resize-none backdrop-blur-sm rounded-lg font-mono",
          "ring-2 ring-(--fg-mini-text)",
          "focus:outline-none focus:ring-2 focus:ring-(--fg-default)",
        ].join(" ")}
        placeholder="Начните писать Markdown здесь..."
        spellCheck="false"
      />

      <div className="mt-2 text-xs text-(--fg-mini-text) flex justify-between">
        <span>Изменения автоматически сохраняются в URL</span>
        <span>Ctrl+S для сохранения файла</span>
      </div>
    </div>
  );
};
