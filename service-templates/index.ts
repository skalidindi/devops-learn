import yargs from "yargs";
import { readFileSync, writeFileSync } from "fs";
import { configure, render } from "nunjucks";

type BuildJsonDockerFile = {
  InstallCommand: string;
  PostInstallCommands: string[];
  PreInstallCommands: string[];
};

type BuildJson = {
  ServiceName: string;
  ServiceType: string;
  Dockerfile: BuildJsonDockerFile;
};

function main() {
  const args = yargs(process.argv.slice(2))
    .options({
      config: {
        type: "string",
        description: "The location of the build.json file",
        default: "./build.json",
      },
    })
    .parseSync();
  try {
    const data = readFileSync("./build.json", "utf-8");
    const configuration = JSON.parse(data) as BuildJson;
    configure("templates", { autoescape: false });
    const dockerfile = render("Dockerfile", configuration);

    writeFileSync("dist/Dockerfile", dockerfile);
  } catch (error) {
    console.error("Error reading file", error);
  }
}

main();
