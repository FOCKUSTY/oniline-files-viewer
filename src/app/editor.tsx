"use client";

import { EditorComponent } from "@/components/editor.component";
import { PreviewComponent } from "@/components/preview.component";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/ui/button.ui";
import { saveFile } from "@/services/save-file.service";

import { Activity, use, useEffect, useState } from "react";
import {
  decodeContent,
  encodeContent,
} from "@/services/encode-content.service";

type Props = {
  query: Promise<{ json?: string }>;
}

type JsonData = Partial<{
  content: string,
  fileName: string,
  previewShowed: boolean,
  editorShowed: boolean
}>

export const Editor = ({ query }: Props) => {
  const router = useRouter();

  const { json } = use(query);
  const { content, fileName, editorShowed, previewShowed } = JSON.parse(json || "{}") as JsonData;

  const [jsonData, setJsonData] = useState<Required<JsonData>>({
    content: content || "",
    fileName: fileName || "markdown.md",
    editorShowed: editorShowed || true,
    previewShowed: previewShowed || true
  });

  const gridCollumns =
    jsonData.editorShowed && jsonData.previewShowed
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1";

  const updateUrlAndJson = (parameter: JsonData) => {
    const data = {
      ...jsonData,
      ...parameter,
    } as Required<JsonData>;

    setJsonData(data);
    
    const jsonUriComponent = encodeURIComponent(JSON.stringify(data));
    const newUrl = '/?json=' + jsonUriComponent;
    router.replace(newUrl, { scroll: false });
  };

  const share = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("json", encodeContent(JSON.stringify(jsonData)));
    navigator.clipboard.writeText(url.toString());
  };

  useEffect(() => {
    try {
      setJsonData({
        content: content || "",
        fileName: fileName || "markdown.md",
        editorShowed: editorShowed || true,
        previewShowed: previewShowed || true
      });
    } catch (error) {
      console.error("Ошибка при декодировании контента из URL");
    }
  }, [content, fileName]);

  return (
    <div className="min-h-full flex flex-col gap-4 justify-center content-center flex-wrap">
      <div className="w-full flex flex-row flex-wrap gap-2 justify-center">
        {jsonData.previewShowed && (
          <Button onClick={() => {
            updateUrlAndJson({editorShowed: !jsonData.editorShowed});
          }}>
            {jsonData.editorShowed ? "Скрыть" : "Показать"} редактор
          </Button>
        )}

        <Button
          onClick={() => {
            saveFile(jsonData.content || "", "markdown.md");
          }}
        >
          Сохранить
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(jsonData.content || "");
          }}
        >
          Скопировать
        </Button>

        <Button onClick={share}>Поделиться</Button>

        {jsonData.editorShowed && (
          <Button onClick={() => {
            updateUrlAndJson({previewShowed: !jsonData.previewShowed});
          }}>
            {jsonData.previewShowed ? "Скрыть" : "Показать"} предпросмотр
          </Button>
        )}
      </div>

      <div className={`grid gap-6 ${gridCollumns}`}>
        <Activity mode={jsonData.editorShowed ? "visible" : "hidden"}>
          <EditorComponent
            content={jsonData.content || ""}
            updateUrl={(value: string) => updateUrlAndJson({content: value})}
            onEdit={(value: string) => setJsonData((p) => ({...p, content: value}))}
          />
        </Activity>

        {jsonData.previewShowed && <PreviewComponent markdown={jsonData.content || ""} />}
      </div>
    </div>
  );
};

export default Editor;
