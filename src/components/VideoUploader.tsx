"use client";

import { UploadButton } from "@/utils/uploadthing";

interface VideoUploaderProps {
  onChange: (url: string) => void;
  value?: string;
}

export default function VideoUploader({ onChange, value }: VideoUploaderProps) {
  return (
    <main className="flex flex-col items-center justify-between p-4">
      <UploadButton
        endpoint="videoUploader" // 👈 correspond à celui défini dans core.ts
        onClientUploadComplete={(res) => {
          onChange(res[0].ufsUrl); // on récupère l’URL de la vidéo
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      {value ? (
        <div className="flex flex-1 w-full h-full mt-4 relative">
          <video
            src={value}
            controls
            className="w-full max-w-md rounded-lg shadow"
          />
        </div>
      ) : null}
    </main>
  );
}
