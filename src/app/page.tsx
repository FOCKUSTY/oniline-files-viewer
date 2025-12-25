"use client";

import { EditorComponent } from "@/components/editor.component";
import { PreviewComponent } from "@/components/preview.component";

import { useState } from "react";

const Page = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [isPreviewShowing, setIsPreviewShowing] = useState<boolean>(false);

  const showPreview = true;
  const gridCollumns = showPreview
    ? "grid-cols-1 lg:grid-cols-2"
    : "grid-cols-1";

  return (
    <div className="h-screen flex justify-center content-center flex-wrap">
      <div>

      </div>

      <div className={`grid gap-6 ${gridCollumns}`}>
        <EditorComponent onEdit={setMarkdown} />
        {showPreview && <PreviewComponent markdown={markdown} />}
      </div>
      
      <div>
        
      </div>
    </div>
  );
};

export default Page;
