"use client";

import { Notifications, Query } from "@/constants";

import { EditorComponent } from "@/components/editor.component";
import { PreviewComponent } from "@/components/preview.component";

import { NotificationWrapperComponent } from "@/components/notification-wrapper.component";
import { NotificationComponent } from "@/components/notification.component";
import { HelpButtons } from "@/components/help-buttons.component";

import { useRouter } from "next/navigation";
import { Activity, use, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

type Props = {
  query: Promise<{ content?: string }>;
};

type JsonData = Partial<{
  content: string;
  previewShowed: boolean;
  editorShowed: boolean;
  synchronousScrollEnabled: boolean;
}>;

export const Editor = ({ query }: Props) => {
  const router = useRouter();

  const { content: json } = use(query);
  const {
    content,
    editorShowed,
    previewShowed,
    synchronousScrollEnabled,
  } = JSON.parse(
    json ? decompressFromEncodedURIComponent(json) : "{}",
  ) as JsonData;

  const [jsonData, setJsonData] = useState<Required<JsonData>>({
    content: content || "",
    editorShowed: editorShowed || true,
    previewShowed: previewShowed || true,
    synchronousScrollEnabled: synchronousScrollEnabled || true,
  });

  const [documentState, setDocumentState] = useState<Document | null>(null);
  const [notificationText, setNotificationText] = useState<string | null>(null);
  const [urlSynconizationEnabled, setUrlSynconizationEnabled] =
    useState<boolean>(true);

  const notificationRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const gridCollumns =
    jsonData.editorShowed && jsonData.previewShowed
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1";

  const updateJson = (data: JsonData) => {
    return setJsonData((p) => ({ ...p, ...data }));
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
    const jsonUriComponent = compressToEncodedURIComponent(
      JSON.stringify(jsonData),
    );
    const href = `/?${Query.json}=` + jsonUriComponent;

    if (urlSynconizationEnabled) {
      router.replace(href, { scroll: false });
    }

    const maxLimitExceeded = href.length >= 5000;
    const urlSynconizationDisabled = !urlSynconizationEnabled;
    if (maxLimitExceeded && urlSynconizationDisabled) {
      return;
    }

    if (maxLimitExceeded) {
      setUrlSynconizationEnabled(false);
      notificate(Notifications.syncronizationInUrlDisabled);
      return;
    }

    if (urlSynconizationDisabled) {
      notificate(Notifications.syncronizationInUrlEnabled);
    }

    return setUrlSynconizationEnabled(true);
  }, [jsonData]);

  useEffect(() => {
    try {
      setJsonData({
        content: content || "",
        editorShowed: editorShowed === undefined ? true : editorShowed,
        previewShowed: previewShowed === undefined ? true : previewShowed,
        synchronousScrollEnabled:
          synchronousScrollEnabled === undefined
            ? true
            : synchronousScrollEnabled,
      });
    } catch (error) {
      console.error("Ошибка при декодировании контента из URL");
    }
  }, [content, editorShowed, previewShowed, synchronousScrollEnabled]);

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
      <HelpButtons
        {...{jsonData, notificate, updateJson}}
      />

      <div className={`grid gap-6 ${gridCollumns}`}>
        <Activity mode={jsonData.editorShowed ? "visible" : "hidden"}>
          <EditorComponent
            synchronousScrollEnabled={jsonData.synchronousScrollEnabled}
            previewRef={previewRef}
            urlSynconizationEnabled={urlSynconizationEnabled}
            content={jsonData.content}
            onEdit={(content: string) => updateJson({ content })}
          />
        </Activity>

        {jsonData.previewShowed && (
          <PreviewComponent ref={previewRef} markdown={jsonData.content} />
        )}
      </div>

      {documentState &&
        createPortal(
          <NotificationWrapperComponent>
            <NotificationComponent
              ref={notificationRef}
              className="duration-300"
              style={{
                display: notificationText ? "flex" : "none",
                opacity: "0",
              }}
            >
              {notificationText}
            </NotificationComponent>
          </NotificationWrapperComponent>,
          documentState.body,
        )}
    </div>
  );
};

export default Editor;
