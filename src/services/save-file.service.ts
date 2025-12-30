import { fileName } from "@/constants";

export const saveFile = (
  content: string | Blob,
  mimeType: string = "text/plain",
) => {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
