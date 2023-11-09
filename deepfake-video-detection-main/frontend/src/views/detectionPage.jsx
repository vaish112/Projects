import { useRef, useState } from "react";
import ResultsModal from "../Components/ResultsModal";
import useAxios from "../utils/useAxios";

function Detection() {
  const [file, setFile] = useState(null);
  let [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    result: "",
    confidence: 0
  });
  const api = useAxios();

  const handleUploadFile = e => {
    const uploadedVideo = e.target.files[0];
    setFile(uploadedVideo);
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(uploadedVideo);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

  const submitVideo = async e => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/detection/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setLoading(false);
      setResult(response.data.response);
      setIsOpen(true);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <section className="px-4">
      <h1 className="text-center">Video Detection</h1>
      <hr className="mb-2" />
      <div>
        <form
          onSubmit={submitVideo}
          className="w-2/3 mx-auto rounded-xl shadow-md bg-slate-50 p-4"
        >
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <p className="font-semibold">
              Select a video file to detect Fake or Real
            </p>
            <label htmlFor="contained-button-file">
              <input
                accept="video/mp4,video/x-m4v,video/*"
                id="contained-button-file"
                ref={videoRef}
                onChange={e => handleUploadFile(e)}
                type="file"
              />
            </label>
          </div>
          <div className="flex justify-center">
            <video
              id="output"
              className="w-3/5 max-w-lg mt-2 rounded-lg"
              controls
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <button
            className={`mt-4 t-btn bg-primary text-white text-3xl w-full`}
            disabled={!file || loading}
          >
            {loading
              ? "Loading..."
              : !file
              ? "Select the video first"
              : "Test the video"}
          </button>
        </form>
        <div className="">
          <ResultsModal
            file={file}
            isOpen={isOpen}
            loading={loading}
            openModal={openModal}
            closeModal={closeModal}
            result={result.output}
            confidence={result.confidence}
          />
        </div>
      </div>
    </section>
  );
}

export default Detection;
