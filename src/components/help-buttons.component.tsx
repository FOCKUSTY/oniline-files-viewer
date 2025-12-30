import { fileName, Notifications, Query, SwitcherText } from "@/constants";
import { saveFile } from "@/services/save-file.service";
import { Button } from "@/ui/button.ui";

import { compressToEncodedURIComponent } from "lz-string";

type JsonData = {
  content: string;
  previewShowed: boolean;
  editorShowed: boolean;
  synchronousScrollEnabled: boolean;
};

type Props = {
  updateJson: (data: Partial<JsonData>) => unknown,
  notificate: (text: string) => unknown;
  jsonData: JsonData;
}

export const HelpButtons = ({ jsonData, updateJson, notificate }: Props) => {
  const share = () => {
    const url = new URL(window.location.href);
    url.searchParams.set(
      Query.json,
      compressToEncodedURIComponent(JSON.stringify(jsonData)),
    );
    navigator.clipboard.writeText(url.toString());
    notificate(Notifications.linkCopied);
  };

  const className = "flex flex-row flex-wrap gap-1";

  return (
    <div className={[className, "w-full gap-2"].join(" ")}>
      <div className={className}>
        {jsonData.previewShowed && (
          <Button
            onClick={() => updateJson({ editorShowed: !jsonData.editorShowed })}
          >
            {jsonData.editorShowed ? SwitcherText.show : SwitcherText.hide} редактор
          </Button>
        )}
    
        {jsonData.editorShowed && (
          <Button
            onClick={() =>
              updateJson({ previewShowed: !jsonData.previewShowed })
            }
          >
            {jsonData.previewShowed ? SwitcherText.show : SwitcherText.hide} предпросмотр
          </Button>
        )}
      </div>
    
      <div className={className}>
        <Button onClick={() => saveFile(jsonData.content)}>
          Сохранить
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(jsonData.content);
            notificate(Notifications.textCopied);
          }}
        >
          Скопировать
        </Button>
    
        <Button onClick={share}>Поделиться</Button>
      </div>
    
      <div className={className}>
        <Button
          onClick={() => {
            updateJson({
              synchronousScrollEnabled: !jsonData.synchronousScrollEnabled,
            });
          }}
        >
          {jsonData.synchronousScrollEnabled ? "Вы" : "В"}ключить синхронный
          скролл
        </Button>
      </div>
    </div>
  )
}