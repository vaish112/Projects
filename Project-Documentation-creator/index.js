#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const init = require("./utils/init");
const cli = require("./utils/cli");
const log = require("./utils/log");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  // add your api key
  apiKey: "",
});
const openai = new OpenAIApi(configuration);
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
  input.includes(`help`) && cli.showHelp(0);
  if (input.includes("summarize")) {
    const textPath = "./docs";

    if (fs.existsSync(textPath)) {
      fs.rmdirSync(textPath, { recursive: true });
      fs.mkdir(textPath, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } else {
      fs.mkdir(textPath, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    function readDirectory(directoryPath) {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }
        files.forEach((file) => {
          const filePath = path.join(directoryPath, file);
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.error(err);
              return;
            }
            if (
              stats.isFile() &&
              !file.includes("git") &&
              !file.includes("json")
            ) {
              const destinationFilePath = `./docs/${file}.txt`;
              fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                  console.error(err);
                  return;
                }
                async function generateCompletion() {
                  const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: ` ${data}explained in a concise way:\n1.`,
                    temperature: 0,
                    max_tokens: 150,
                  });

                  console.log(response.data.choices[0].text);
                  fs.writeFile(
                    destinationFilePath,
                    response.data.choices[0].text,
                    (err) => {
                      if (err) {
                        console.error(err);
                        return;
                      }
                    }
                  );
                }

                generateCompletion();
              });
            }
            if (
              stats.isDirectory() &&
              !file.includes("node_modules") &&
              !file.includes("git")
            ) {
              readDirectory(filePath); // Recursively read the directory
            }
          });
        });
      });
    }
    const directoryPath = "./";
    readDirectory(directoryPath);
  }
  debug && log(flags);
})();
