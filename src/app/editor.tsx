"use client";

import type { CSSProperties } from "react";

import { EditorComponent } from "@/components/editor.component";
import { PreviewComponent } from "@/components/preview.component";

import { Button } from "@/ui/button.ui";
import { saveFile } from "@/services/save-file.service";

import { NotificationWrapperComponent } from "@/components/notification-wrapper.component";
import { NotificationComponent } from "@/components/notification.component";

import { useRouter } from "next/navigation";
import { Activity, use, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"

type Props = {
  query: Promise<{ content?: string }>;
}

type JsonData = Partial<{
  content: string,
  fileName: string,
  previewShowed: boolean,
  editorShowed: boolean
}>;

const notificationTransitions: Record<string, CSSProperties> = {
  entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0 },
  exited:  { opacity: 0 },
}

export const Editor = ({ query }: Props) => {
  const router = useRouter();

  const { content: json } = use(query);
  const { content, fileName, editorShowed, previewShowed } = JSON.parse(json ? decompressFromEncodedURIComponent(json) : "{}") as JsonData;

  const [ jsonData, setJsonData ] = useState<Required<JsonData>>({
    content: content || "",
    fileName: fileName || "markdown.md",
    editorShowed: editorShowed || true,
    previewShowed: previewShowed || true
  });

  const [ documentState, setDocumentState ] = useState<Document|null>(null);
  const [ notificationText, setNotificationText ] = useState<string|null>(null);

  const gridCollumns =
    jsonData.editorShowed && jsonData.previewShowed
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1";

  const updateJson = (data: JsonData) => {
    return setJsonData((p) => ({...p, ...data }));
  };
  
  const share = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("content", compressToEncodedURIComponent(JSON.stringify(jsonData)));
    navigator.clipboard.writeText(url.toString());
  };

  useEffect(() => {
    const jsonUriComponent = compressToEncodedURIComponent(JSON.stringify(jsonData));
    const href = '/?content=' + jsonUriComponent;
    router.replace(href, { scroll: false });
    
    if (href.length < 10000) {
      return;
    }
    
    setNotificationText("Синхронизация по URL отключена");

    for (let i=0; i < 10; i++) {
      setTimeout(() => {
        console.error("СООБЩИТЕ РАЗРАБОТЧИКУ ПОФИКСИТЬ ПРОБЛЕМУ: https://github.com/fockusty/oniline-files-viewer/issues/new");
        console.error("ПИШИТЕ: ЗДРАВСТВУЙТЕ, ВАМ НУЖНО ПОФИКСИТЬ ПРОБЛЕМУ");
      }, 100 * i);
    }
  }, [jsonData]);

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
  }, [content, fileName, editorShowed, previewShowed]);

  useEffect(() => {
    setDocumentState(document);
  }, []);
  
  return (
    <div className="min-h-full flex flex-col gap-4 justify-center content-center flex-wrap">
      <div className="w-full flex flex-row flex-wrap gap-2 justify-center">
        {jsonData.previewShowed && (
          <Button onClick={() => updateJson({editorShowed: !jsonData.editorShowed})}>
            {jsonData.editorShowed ? "Скрыть" : "Показать"} редактор
          </Button>
        )}

        <Button
          onClick={() => saveFile(jsonData.content || "", "markdown.md")}
        >
          Сохранить
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(jsonData.content);
          }}
        >
          Скопировать
        </Button>

        <Button onClick={share}>Поделиться</Button>

        {jsonData.editorShowed && (
          <Button onClick={() => updateJson({previewShowed: !jsonData.previewShowed})}>
            {jsonData.previewShowed ? "Скрыть" : "Показать"} предпросмотр
          </Button>
        )}
      </div>

      <div className={`grid gap-6 ${gridCollumns}`}>
        <Activity mode={jsonData.editorShowed ? "visible" : "hidden"}>
          <EditorComponent
            content={jsonData.content}
            onEdit={(content: string) => updateJson({content})}
          />
        </Activity>

        {jsonData.previewShowed && <PreviewComponent markdown={jsonData.content} />}
      </div>

      {documentState && notificationText && createPortal((
        <NotificationWrapperComponent>
          <NotificationComponent>
            {notificationText!}
          </NotificationComponent>
        </NotificationWrapperComponent>
      ), documentState.body)}
    </div>
  );
};

export default Editor;
