"use client";

import { EditorComponent } from "@/components/editor.component";
import { PreviewComponent } from "@/components/preview.component";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/ui/button.ui";
import { saveFile } from "@/services/save-file.service";

import { Activity, useEffect, useRef, useState } from "react";
import {
  decodeContent,
  encodeContent,
} from "@/services/encode-content.service";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [markdown, setMarkdown] = useState<string>("");
  const [isEditorShowing, setIsEditorShowing] = useState<boolean>(true);
  const [isPreviewShowing, setIsPreviewShowing] = useState<boolean>(true);

  const gridCollumns =
    isEditorShowing && isPreviewShowing
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1";

  const updateUrl = () => {
    const encodedContent = encodeContent(markdown);
    const newUrl = `/?content=${encodedContent}${`&filename=${encodeURIComponent("markdown.md")}`}`;
    router.replace(newUrl, { scroll: false });
  };

  const share = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("content", encodeContent(markdown));
    navigator.clipboard.writeText(url.toString());
  };

  useEffect(() => {
    const contentParam = searchParams.get("content");
    if (!contentParam) {
      return;
    }

    try {
      const decodedContent = decodeContent(contentParam);
      if (!decodedContent) {
        return;
      }

      setMarkdown(decodedContent);
    } catch (error) {
      console.error("Ошибка при декодировании контента из URL");
    }
  }, [searchParams]);

  return (
    <div className="min-h-full flex flex-col gap-4 justify-center content-center flex-wrap">
      <div className="w-full flex flex-row flex-wrap gap-2 justify-center">
        {isPreviewShowing && (
          <Button onClick={() => setIsEditorShowing(!isEditorShowing)}>
            {isEditorShowing ? "Скрыть" : "Показать"} редактор
          </Button>
        )}

        <Button
          onClick={() => {
            saveFile(markdown, "markdown.md");
          }}
        >
          Сохранить
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(markdown);
          }}
        >
          Скопировать
        </Button>

        <Button onClick={share}>Поделиться</Button>

        {isEditorShowing && (
          <Button onClick={() => setIsPreviewShowing(!isPreviewShowing)}>
            {isPreviewShowing ? "Скрыть" : "Показать"} предпросмотр
          </Button>
        )}
      </div>

      <div className={`grid gap-6 ${gridCollumns}`}>
        <Activity mode={isEditorShowing ? "visible" : "hidden"}>
          <EditorComponent
            content={markdown}
            updateUrl={updateUrl}
            onEdit={setMarkdown}
          />
        </Activity>

        {isPreviewShowing && <PreviewComponent markdown={markdown} />}
      </div>
    </div>
  );
};

export default Page;
