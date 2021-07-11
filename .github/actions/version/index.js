const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");
const fs = require("fs");

async function run() {
	const token = core.getInput("token");
	const octokit = github.getOctokit(token);

	const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

	core.info(`Repository ${owner}/${repo}`);

	const currentVersion = await core.group("Get current version", async () => {
		try {
			const manifestPath = path.join(process.env.GITHUB_WORKSPACE, "public/manifest.json");
			const manifest = fs.readFileSync(manifestPath);
			const { version } = JSON.parse(manifest);

			core.info(`Detected version: ${version}`);

			return version;
		} catch (error) {
			core.setFailed(`Unable to get current version.`);
			core.error(error);
			process.exit();
		}
	});

	const previousVersion = await core.group("Get release version", async () => {
		try {
			const {
				data: { tag_name: version },
			} = await octokit.repos.getLatestRelease({
				owner,
				repo,
			});

			core.info(`Previous release version: ${version}`);

			if (version === currentVersion) {
				core.info("Version has not changed.");
				process.exit();
			}

			return version;
		} catch (error) {
			core.info("No previous release version.");
		}
	});

	core.setOutput("versionChanged", true);
	core.setOutput("currentVersion", currentVersion);
	core.setOutput("previousVersion", previousVersion);
}

run();
