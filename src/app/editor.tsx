"use client";

import { EditorComponent } from "@/components/editor.component";
import { PreviewComponent } from "@/components/preview.component";

import { Button } from "@/ui/button.ui";
import { saveFile } from "@/services/save-file.service";

import { NotificationWrapperComponent } from "@/components/notification-wrapper.component";
import { NotificationComponent } from "@/components/notification.component";

import { useRouter } from "next/navigation";
import { Activity, use, useEffect, useRef, useState } from "react";
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
  const [ urlSynconizationEnabled, setUrlSynconizationEnabled ] = useState<boolean>(true);
  
  const notificationRef = useRef<HTMLDivElement|null>(null);

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
    notificate("Ссылка скопирована!");
  };

  const clearNotification = () => {
    if (!notificationRef.current) {
      return;
    }
    
    notificationRef.current.style.opacity = "0";
    setTimeout(() => {
      notificationRef.current!.style.display = "none";
      setNotificationText(null);
    }, 300);
  };

  const notificate = (text: string) => {
    if (!notificationRef.current) {
      return;
    }
    
    notificationRef.current.style.display = "flex";
    setTimeout(() => {
      notificationRef.current!.style.opacity = "1";
    }, 100);

    setNotificationText(text);
  };

  useEffect(() => {
    setDocumentState(document);
  }, []);

  useEffect(() => {
    const jsonUriComponent = compressToEncodedURIComponent(JSON.stringify(jsonData));
    const href = '/?content=' + jsonUriComponent;

    if (urlSynconizationEnabled) {
      router.replace(href, { scroll: false });
    }

    const maxLimitExceeded = href.length >= 10000;
    const urlSynconizationDisabled = !urlSynconizationEnabled;
    if (maxLimitExceeded && urlSynconizationDisabled) {
      return;
    }

    if (maxLimitExceeded) {
      setUrlSynconizationEnabled(false);
      notificate("Синхронизация по URL отключена");
      return;
    }
    
    if (urlSynconizationDisabled) {
      notificate("Синхронизация по URL включена");
    }

    return setUrlSynconizationEnabled(true);
  }, [jsonData]);

  useEffect(() => {
    try {
      setJsonData({
        content: content || "",
        fileName: fileName || "markdown.md",
        editorShowed: editorShowed === undefined ? true : editorShowed,
        previewShowed: previewShowed === undefined ? true : previewShowed
      });
    } catch (error) {
      console.error("Ошибка при декодировании контента из URL");
    }
  }, [content, fileName, editorShowed, previewShowed]);

  useEffect(() => {
    if (!notificationText) {
      return;
    }

    setTimeout(() => {
      clearNotification();
    }, 1000);
  }, [notificationText]);
  
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
            notificate("Текст скопирован!");
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

      {documentState && createPortal((
        <NotificationWrapperComponent>
          <NotificationComponent
            ref={notificationRef}
            className="duration-300"
            style={{
              display: notificationText ? "flex" : "none",
              opacity: "0"
            }}
          >
            {notificationText}
          </NotificationComponent>
        </NotificationWrapperComponent>
      ), documentState.body)}
    </div>
  );
};

export default Editor;
