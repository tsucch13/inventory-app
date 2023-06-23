import React, { FC, ReactNode } from "react";
import { Document as PdfDocument } from "@react-pdf/renderer";

interface Props {
  pdfMode?: boolean;
  children?: ReactNode;
}

const Document: FC<Props> = ({ pdfMode, children }) => {
  return (
    <>
      {pdfMode ? (
        <PdfDocument style={{ backgroundColor: "#ffc0cb" }}>
          {children}
        </PdfDocument>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Document;
