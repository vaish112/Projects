import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RadioGroup } from "@headlessui/react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

function ModalContent({ file, result }) {
  let [userKnow, setUserKnow] = useState("no");
  let [predictionCorrect, setPredictionCorrect] = useState("yes");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    if (userKnow === "yes" && predictionCorrect === "no") setShowSubmit(true);
    else setShowSubmit(false);
  }, [userKnow, predictionCorrect]);

  const handleFeedbackSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const storageRef = ref(storage, "review-videos/" + Date.now() + ".mp4");

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then(snapshot => {
      setLoading(false);
      setMessage("Thank you for your feedback!");
    });
  };

  return (
    <div className="flex-1">
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className={`mt-4 p-2 mx-auto rounded-xl shadow-md text-white ${
          result === "FAKE" ? "bg-red-600" : "bg-green-600"
        }`}
      >
        <div className="w-full text-center">
          <p className="text-xl">This video is</p>
          <h1 className="text-3xl">{result}</h1>
        </div>
      </motion.div>
      <motion.form
        className="mt-6"
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onSubmit={handleFeedbackSubmit}
      >
        <h2 className="text-xl font-bold">Feedback</h2>
        <hr className="border-slate-400" />
        <div className="flex items-center my-4">
          <label className="block text-sm font-bold" htmlFor="username">
            Do you know about this video?
          </label>
          <RadioGroup
            value={userKnow}
            onChange={setUserKnow}
            className="flex ml-4"
          >
            <RadioGroup.Option value="yes">
              {({ checked }) => (
                <span
                  className={`px-4 mr-2 cursor-pointer py-1 w-full rounded-md font-semibold ${
                    checked ? "bg-green-700 text-white" : ""
                  }`}
                >
                  Yes
                </span>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="no">
              {({ checked }) => (
                <span
                  className={`px-4 mr-2 cursor-pointer py-1 w-full rounded-md font-semibold ${
                    checked ? "bg-green-700 text-white" : ""
                  }`}
                >
                  No
                </span>
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>
        {userKnow === "yes" && (
          <motion.div
            className="flex items-center my-4"
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-sm font-bold" htmlFor="username">
              Was our prediction correct?
            </label>
            <RadioGroup
              value={predictionCorrect}
              onChange={setPredictionCorrect}
              className="flex ml-4"
            >
              <RadioGroup.Option value="yes">
                {({ checked }) => (
                  <span
                    className={`px-4 mr-2 cursor-pointer py-1 w-full rounded-md font-semibold ${
                      checked ? "bg-green-700 text-white" : ""
                    }`}
                  >
                    Yes
                  </span>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option value="no">
                {({ checked }) => (
                  <span
                    className={`px-4 mr-2 cursor-pointer py-1 w-full rounded-md font-semibold ${
                      checked ? "bg-green-700 text-white" : ""
                    }`}
                  >
                    No
                  </span>
                )}
              </RadioGroup.Option>
            </RadioGroup>
          </motion.div>
        )}
        <hr className="border-slate-400" />
        {predictionCorrect === "no" && userKnow === "yes" && (
          <motion.div
            className="flex items-center my-2"
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="">
              <h2 className="text-md font-bold">
                Means above video was
                <span
                  className={`${
                    result !== "FAKE" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {result === "FAKE" ? " Real" : " Fake"}
                </span>
              </h2>
            </div>
          </motion.div>
        )}
        {showSubmit && (
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className={`mt-4 t-btn bg-primary text-white text-xl w-full disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
            <p className="italic text-sm mt-1 text-center">
              {loading &&
                "It may take few time depending upon the network connection"}
            </p>
          </motion.div>
        )}
      </motion.form>
      {message && (
        <motion.p
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-2 bg-green-700 rounded-lg px-4 py-2 text-white"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

export default ModalContent;
