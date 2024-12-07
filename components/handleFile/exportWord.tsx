"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { FileOutput, Loader2 } from "lucide-react";

// Import PizZipUtils dynamically for the browser environment
let PizZipUtils: any = null;
if (typeof window !== "undefined") {
  import("pizzip/utils/index.js").then(function (r) {
    PizZipUtils = r;
  });
}

const loadFile = (
  url: string,
  callback: (error: any, content: any) => void
) => {
  if (PizZipUtils) {
    PizZipUtils.getBinaryContent(url, callback);
  } else {
    console.error("PizZipUtils is not loaded.");
  }
};

const generateDocument = (file: any) => {
  loadFile(file.url, function (error, content) {
    if (error) {
      console.error("Error loading the template file:", error);
      return;
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      linebreaks: true,
      paragraphLoop: true,
    });

    // Replace placeholders in the document
    doc.render(file.data);

    // Generate the final Word document as a blob
    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Trigger file download
    saveAs(blob, `${file.outputName ?? "output.docx"}.docx`);
  });
};

export default function ExportWord({
  data,
  children,
}: {
  data: any;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    generateDocument(data);
    setLoading(false);
  };

  return (
    <button
      title={"Xuất file"}
      type="button"
      disabled={loading}
      onClick={handleClick}
      className={`hover:shadow-form flex items-center justify-center w-full rounded-md ${
        loading ? "bg-indigo-400" : "bg-[#6A64F1]"
      } hover:bg-indigo-400 py-3 px-8 text-center text-base font-semibold text-white outline-none`}
    >
      <Loader2
        className={`mr-2 h-4 w-4 animate-spin ${loading ? "block" : "hidden"}`}
      />
      <FileOutput className="w-5 h-5 text-white mr-2" />
      {children}
    </button>
  );
}
