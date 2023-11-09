import { motion } from "framer-motion";
function Results({ result, confidence }) {
  return (
    <motion.div
      initial={{ scale: 0.75, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
      className={`mt-4 p-2 w-2/3 mx-auto rounded-xl shadow-md text-white ${
        result === "FAKE" ? "bg-red-600" : "bg-green-600"
      }`}
    >
      <div className="w-full text-center">
        <p className="text-xl">This video is</p>
        <h1 className="text-3xl">{result}</h1>
      </div>
    </motion.div>
  );
}

export default Results;
