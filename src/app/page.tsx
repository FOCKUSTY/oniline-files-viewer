"use client";

import { EditorComponent } from "@/components/editor.component";
import { PreviewComponent } from "@/components/preview.component";

import { Button } from "@/ui/button.ui";
import { saveFile } from "@/services/save-file.service";

import { Activity, useState } from "react";

const Page = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [isEditorShowing, setIsEditorShowing] = useState<boolean>(true);
  const [isPreviewShowing, setIsPreviewShowing] = useState<boolean>(true);

  const gridCollumns = (isEditorShowing && isPreviewShowing)
    ? "grid-cols-1 lg:grid-cols-2"
    : "grid-cols-1";

  return (
    <div className="min-h-full flex flex-col gap-4 justify-center content-center flex-wrap">
      <div className="w-full flex flex-row flex-wrap gap-2 justify-center">
        {isPreviewShowing && <Button onClick={() => setIsEditorShowing(!isEditorShowing)}>
          {isEditorShowing ? "Скрыть" : "Показать"} редактор
        </Button>}

        <Button onClick={() => {
          saveFile(markdown, "markdown.md");
        }}>Сохранить</Button>
        <Button onClick={() => {
          navigator.clipboard.writeText(markdown);
        }}>Скопировать</Button>
        <Button>Поделиться</Button>

        {isEditorShowing && <Button onClick={() => setIsPreviewShowing(!isPreviewShowing)}>
          {isPreviewShowing ? "Скрыть" : "Показать"} предпросмотр
        </Button>}
      </div>

      <div className={`grid gap-6 ${gridCollumns}`}>
        <Activity mode={isEditorShowing ? "visible" : "hidden"}>
          <EditorComponent onEdit={setMarkdown} />
        </Activity>

        {isPreviewShowing && <PreviewComponent markdown={markdown} />}
      </div>
    </div>
  );
};

export default Page;
