"use client";

import { EditorComponent } from "@/components/editor.component";
import { PreviewComponent } from "@/components/preview.component";
import { useRef, useState } from "react";

const Page = () => {
  const preview = useRef<HTMLParagraphElement | null>(null);
  const [markdown, setMarkdown] = useState<string>("");

  const showPreview = true;
  const gridCollumns = showPreview
    ? "grid-cols-1 lg:grid-cols-2"
    : "grid-cols-1";

  const onEdit = (value: string) => {
    if (!preview.current) {
      return;
    }

    // preview.current.innerHTML = value;
    setMarkdown(value);
  };

  return (
    <div className="h-screen flex justify-center content-center flex-wrap">
      <div className={`grid gap-6 ${gridCollumns}`}>
        <EditorComponent onEdit={setMarkdown} />
        {showPreview && <PreviewComponent markdown={markdown} />}
      </div>
    </div>
  );
};

export default Page;
