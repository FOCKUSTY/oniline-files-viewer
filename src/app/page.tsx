"use client";

import { Editor } from "./editor";
import { Suspense } from "react";

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{ content?: string }>;
}) => {
  return (
    <Suspense fallback={<>...</>}>
      <Editor query={searchParams} />
    </Suspense>
  );
};

export default Page;
