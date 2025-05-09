import React, { useEffect, useState } from "react";
import axios from "axios";
import Dnd from "./Dnd";

import { MdDelete } from "react-icons/md";
import FlagComponent from "./FlagComponent";
import { IoQrCodeSharp } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import QRCodeGenerator from "./QRCodeGenerator";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderx, setLoaderx] = useState(false);
  const [progress, setProgress] = useState(0);
  const [qrText, setQrText] = useState(null);

  const handleCopy = (copyText) => {
    navigator.clipboard.writeText(copyText)
      .then(() => {
        console.log("copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  }


  const handleUpload = async () => {
    setLoader(true);
    if (!file) {
      setLoader(false);

      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            // Calculate upload progress percentage
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      setDownloadLinks(response.data.downloadURL);
      setFile(null);
      setProgress(0);
      setLoader(false);
    } catch (error) {
      console.error("Upload error:", error);
      setProgress(0);
      setFile(null);
      setLoader(false);
    }
  };
  const getFiles = async () => {
    setLoaderx(true);
    try {
      const response = await axios.get(`${BASE_URL}/files`);

      setDownloadLinks(response.data.downloadURL);
      setLoaderx(false);
    } catch (error) {
      setLoaderx(false);
      console.error("Files fetch error", error);
    }
  };
  const deleteFile = async (filename) => {
    setLoaderx(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/delete/${filename}`
      );

      setDownloadLinks(response.data.downloadURL);
      setLoaderx(false);
    } catch (error) {
      console.error("Files fetch error", error);
      setLoaderx(false);
    }
  };

  useEffect(() => {
    if (file) {
      handleUpload();
    }
    console.log(file);
  }, [file]);

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full p-4 relative">
      {qrText && (
        <div class="absolute inset-0 bg-black/50 z-10 rounded-md flex justify-center items-center backdrop-blur-sm">
          <QRCodeGenerator qrText={qrText} setQrText={setQrText} BASE_URL={BASE_URL} />
        </div>
      )}
      {loaderx && (
        <div class="absolute inset-0 bg-black/50 z-10 rounded-md flex justify-center items-center backdrop-blur-sm">
          <img className="w-24 h-24" src="/loader.svg" alt="" />
        </div>
      )}

      <div className="flex flex-col justify-between items-center gap-4 w-full">
        {/*  ----------------flag-------------- */}
        <div className="flex">
          <div className="w-[74px] h-20"></div>
          <div className="w-20 h-20">
            <FlagComponent />
          </div>
        </div>

        <div className="w-full max-w-[600px] relative">
          {loader && (
            <div class="absolute inset-0 bg-black/50 z-10 rounded-md flex flex-col gap-4 justify-center items-center backdrop-blur-sm">
              <img className="w-24 h-24" src="/loader.svg" alt="" />
              <div className="w-[80%] h-6 bg-white p-[2px] rounded-sm flex justify-start">
                <div
                  style={{ width: `${progress}%` }}
                  className={` text-center text-xs font-semibold bg-green-400 rounded-sm text-white flex items-center justify-center`}
                >
                  {progress == 100 ? "Finishing" : ""}
                </div>
              </div>
            </div>
          )}
          {downloadLinks.length > 4 && (
            <div class="absolute inset-0 bg-black/50 z-10 rounded-md flex justify-center items-center backdrop-blur-sm">
              <p className="text-white font-bold text-base text-center">
                Maximum 5 files allowed<br></br>Delete one or more files to
                upload more
              </p>
            </div>
          )}
          <Dnd file={file} setFile={setFile} />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-[600px]">
          {downloadLinks.map((file) => (
            <div key={file} className="w-full border border-green-400 rounded-md flex items-center justify-between">
              <a
                className="truncate text-sm text-blue-400 font-medium pl-2 pr-6 hover:text-gray-300"
                href={`${BASE_URL}/download/${file}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="">{file}</p>
              </a>
              <div className="flex">
                <div
                  onClick={() => {
                    handleCopy(`curl -o "${file}" "${BASE_URL}/download/${file}"`);
                  }}
                  className="w-10 h-8 min-w-10 bg-gray-400 hover:bg-gray-600 flex items-center justify-center border-r border-gray-300 cursor-pointer"
                >
                  <p className="text-white">CP</p>
                </div>
                <div
                  onClick={() => {
                    handleCopy(`Invoke-WebRequest -Uri "${BASE_URL}/download/${file}" -OutFile "${file}"`);
                  }}
                  className="w-10 h-8 min-w-10 bg-gray-400 hover:bg-gray-600 flex items-center justify-center border-r border-gray-300 cursor-pointer"
                >
                  <p className="text-white">PS</p>
                </div>

                <div
                  onClick={() => {
                    setQrText(file);
                  }}
                  className="w-10 h-8 min-w-10 bg-gray-400 hover:bg-gray-600 flex items-center justify-center border-r border-gray-300 cursor-pointer"
                >
                  <IoQrCodeSharp color="white" size={20} />
                </div>
                <div
                  onClick={() => {
                    handleCopy(`${BASE_URL}/download/${file}`);
                  }}
                  className="w-10 h-8 min-w-10 bg-gray-400 hover:bg-gray-600 flex items-center justify-center cursor-pointer"
                >
                  <MdContentCopy color="white" size={20} />
                </div>
                <div
                  onClick={() => {
                    deleteFile(file);
                  }}
                  className="w-10 h-8 min-w-10 bg-red-400 hover:bg-red-600 flex items-center justify-center rounded-r-[5px] cursor-pointer"
                >
                  <MdDelete color="white" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
