const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");
const AdmZip = require("adm-zip");

async function run() {
	const token = core.getInput("token");
	const octokit = github.getOctokit(token);

	const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

	core.info(`Repository ${owner}/${repo}`);

	const currentVersion = core.getInput("currentVersion");
	const previousVersion = core.getInput("previousVersion");

	const changelog = previousVersion
		? `https://github.com/${owner}/${repo}/compare/${previousVersion}...${currentVersion}`
		: `Initial release`;
	const upload_url = await core.group("Create new release", async () => {
		try {
			const {
				data: { upload_url: url },
			} = await octokit.repos.createRelease({
				owner,
				repo,
				tag_name: currentVersion,
				name: currentVersion,
				body: changelog,
			});

			core.info(`Created release for version ${currentVersion}`);

			return url;
		} catch (error) {
			core.setFailed(
				`Failed to create release ${currentVersion} for ${owner}/${repo}#${process.env.GITHUB_SHA}.`
			);
			core.error(error);
			core.debug(JSON.stringify(error.headers));
			core.debug(JSON.stringify(error.request));
			process.exit();
		}
	});

	const buffer = await core.group("Save zipped source to buffer", async () => {
		try {
			const sourcePath = path.join(process.env.GITHUB_WORKSPACE, "dist");

			const zip = new AdmZip();
			zip.addLocalFolder(sourcePath);
			const zipped = zip.toBuffer();

			core.info(`Stored zipped source to buffer.`);

			return zipped;
		} catch (error) {
			core.setFailed(`Failed to store zip.`);
			core.error(error);
			process.exit();
		}
	});

	await core.group("Upload zipped buffer to release", async () => {
		try {
			await octokit.repos.uploadReleaseAsset({
				url: upload_url,
				headers: {
					"content-type": "application/zip",
					"content-length": buffer.length,
				},
				name: `SxDashPlus-${currentVersion}.zip`,
				data: buffer,
			});

			core.info(`Uploaded asset to release.`);
		} catch (error) {
			core.setFailed(`Failed to upload release asset.`);
			core.error(error);
			process.exit();
		}
	});
}

run();
