const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

const token = core.getInput('token');
const octokit = github.getOctokit(token);

async function main() {
	const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

	core.info(`Repository ${owner}/${repo}`);

	let currentVersion
	try {
		const manifestPath = path.join(process.env.GITHUB_WORKSPACE, 'src/manifest.json')
		const manifest = fs.readFileSync(manifestPath)
		const { version } = JSON.parse(manifest);

		currentVersion = version

		core.info(`Detected version: ${currentVersion}`);
	} catch (error) {
		core.setFailed(`Unable to get current version.`);
		core.error(error);
		process.exit();
	}

	let previousVersion
	try {
		const { data } = await octokit.repos.getLatestRelease({
			owner,
			repo
		});
		previousVersion = data.tag_name

		core.info(`Previous release version: ${previousVersion}`);

		if (previousVersion === currentVersion) {
			core.info('Version has not changed.');
			process.exit();
		}
	} catch (error) {
		core.info('No previous release version.');
	}

	const changelog = previousVersion ? `https://github.com/${owner}/${repo}/compare/${previousVersion}...${version}` : `Initial release`

	let upload_url
	try {
		const { data } = await octokit.repos.createRelease({
			owner,
			repo,
			tag_name: currentVersion,
			name: currentVersion,
			body: changelog
		});
		upload_url = data.upload_url

		core.info(`Created release ${data.name}`);
	} catch (error) {
		core.setFailed(`Failed to create release ${currentVersion} for ${owner}/${repo}#${process.env.GITHUB_SHA}.`);
		core.error(error);
		core.debug(JSON.stringify(error.headers));
		core.debug(JSON.stringify(error.request));
		process.exit();
	}

	let buffer
	try {
		const sourcePath = path.join(process.env.GITHUB_WORKSPACE, 'src')

		const zip = new AdmZip();
		zip.addLocalFolder(sourcePath);
		buffer = zip.toBuffer();

		core.info(`Stored zip to buffer.`);
	} catch (error) {
		core.setFailed(`Failed to save zip.`);
		core.error(error);
		process.exit();
	}

	try {
		core.info(buffer.length)
		core.info(buffer)

		await octokit.repos.uploadReleaseAsset({
			url: upload_url,
			headers: {
				'content-type': 'application/zip',
				'content-length': buffer.length
			},
			name: `SxDashPlus-${currentVersion}.zip`,
			data: buffer
		});

		core.info(`Uploaded asset to release.`);
	} catch (error) {
		core.setFailed(`Failed to upload release asset.`);
		core.error(error);
		process.exit();
	}
}

main();