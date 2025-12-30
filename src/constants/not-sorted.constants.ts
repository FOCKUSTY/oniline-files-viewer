export const enum SwitcherText {
  show = "Показать",
  hide = "Скрыть"
}

export const enum ActiveStateText {
  visible = "visible",
  hidden = "hidden"
}

export const enum Notifications {
  textCopied = "Текст скопирован!",
  linkCopied = "Ссылка скопирована!",
  syncronizationInUrlDisabled = "Синхронизация по URL отключена",
  syncronizationInUrlEnabled = "Синхронизация по URL включена"
}

export const getChangesSavingInUrlText = (saving: boolean) => {
  return `Изменения ${saving ? "" : "не"} сохраняются в URL`;
};

export const yearOfStart = "2025";
export const company = "The Void";
export const fileName = "markdown.md";
