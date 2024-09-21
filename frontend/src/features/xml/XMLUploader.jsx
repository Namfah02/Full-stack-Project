import { useRef, useState } from "react";
import { API_URL } from "../../api/api";
import { useAuthentication } from "../authentication";

export function XMLUploader({ onUploadSuccess, uploadUrl, disabled = false }) {
  const [user] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");

  //useRef in this context is the correct react way of getting an element
  const uploadInputRef = useRef(null);

  function uploadFile(e) {
    e.preventDefault();

    // Select the first file that was picked
    // File array becuase the user could select multiple files when selecting with the file dialog
    const file = uploadInputRef.current.files[0];

    // Fetch needs multi-part form data which includes the file we need to upload
    const formData = new FormData();
    formData.append("xml-file", file);

    // Fetch to sent data to the backend
    fetch(API_URL + uploadUrl, {
      method: "POST",
      headers: {
        "X-AUTH-KEY": user.authenticationKey,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((APIResponse) => {
        setStatusMessage(APIResponse.message);
        // clear the selected file
        uploadInputRef.current.value = null;
        // Notify of successful upload
        if (typeof onUploadSuccess === "function") {
          onUploadSuccess();
        }
      })
      .catch((error) => {
        setStatusMessage("Upload failed: " + error);
      });
  }

  function cancelUpload() {
    uploadInputRef.current.value = null
    setStatusMessage("Cancel upload file")
  }

  return (
    <div>
      <form className="flex-grow m-4 max-w-2xl" onSubmit={uploadFile}>
        <div className="form-control">
          <div className="flex flex-col gap-2">
            <div>
              <input
                ref={uploadInputRef}
                type="file"
                disabled={disabled}
                className="file-input file-input-bordered file-input-md w-full max-w-xs"
              />
            </div>
            <div>
              <button
                disabled={disabled}
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 m-8 border-b-4 border-red-700 hover:border-red-500 rounded"
              >
                Upload
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 m-8 px-4 border-b-4 hover:border-gray-500 rounded"
              type="button" 
              onClick={cancelUpload} 
              >
                Cancel
              </button>
            </div>
          </div>
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}

