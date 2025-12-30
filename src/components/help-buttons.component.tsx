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
      "content",
      compressToEncodedURIComponent(JSON.stringify(jsonData)),
    );
    navigator.clipboard.writeText(url.toString());
    notificate("Ссылка скопирована!");
  };

  const className = "flex flex-row flex-wrap gap-1";

  return (
    <div className={[className, "w-full gap-2"].join(" ")}>
      <div className={className}>
        {jsonData.previewShowed && (
          <Button
            onClick={() => updateJson({ editorShowed: !jsonData.editorShowed })}
          >
            {jsonData.editorShowed ? "Скрыть" : "Показать"} редактор
          </Button>
        )}
    
        {jsonData.editorShowed && (
          <Button
            onClick={() =>
              updateJson({ previewShowed: !jsonData.previewShowed })
            }
          >
            {jsonData.previewShowed ? "Скрыть" : "Показать"} предпросмотр
          </Button>
        )}
      </div>
    
      <div className={className}>
        <Button onClick={() => saveFile(jsonData.content, "markdown.md")}>
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