"use client";

import { UploadButton } from "@/utils/uploadthing";
// import { useState } from "react";
import Image from "next/image"

interface ImageUploaderProps {
  onChange: (url: string) => void;
  value?: string;
}

export default function ImageUploader({ onChange, value }: ImageUploaderProps) {
  // const [imageUrl,setImageUrl]= useState<string>('')
  return (
    // <main className="flex min-h-screen flex-col 
    // items-center justify-between p-24">
    <main className="flex flex-col items-center justify-between p-4">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          onChange(res[0].ufsUrl);
          // Do something with the response
          // console.log("Files: ", res);
          // setImageUrl(res[0].url)
          // alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      {value ? <div className="flex flex-1 w-full h-full mt-4 relative">
        <Image src={value}
        // src={imageUrl} 
        alt=''
        width={100} height={100} className="object-cover" />
      </div> : null}
    </main>
  );
}
