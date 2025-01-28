import React from "react";
import QRCode from "react-qr-code";

const QRCodeGenerator = ({ qrText, setQrText, BASE_URL}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-md gap-3">
      <QRCode
        fgColor="#00a63e"
        value={`${BASE_URL}/download/${qrText}`}
        size={300}
      />
      <p className="text-left text-sm font-semibold text-gray-600 text-wrap break-words w-[300px]">
        {qrText}
      </p>
      <div
        onClick={() => {
          setQrText(null);
        }}
        className="h-8 w-[300px] cursor-pointer bg-red-400 rounded-sm text-sm text-white font-semibold flex justify-center items-center"
      >
        Close
      </div>
    </div>
  );
};

export default QRCodeGenerator;
