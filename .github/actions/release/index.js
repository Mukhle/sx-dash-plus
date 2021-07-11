const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const ChromeExtension = require('crx');

async function run() {
	const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

	const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

	core.info(`Repository ${owner}/${repo}`);

	const currentVersion = core.getInput('currentVersion');
	const previousVersion = core.getInput('previousVersion');

	const changelog = previousVersion ? `https://github.com/${owner}/${repo}/compare/${previousVersion}...${currentVersion}` : `Initial release`;
	const upload_url = await core.group('Create new release', async () => {
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
			core.setFailed(`Failed to create release ${currentVersion} for ${owner}/${repo}#${process.env.GITHUB_SHA}.`);
			core.error(error);
			core.debug(JSON.stringify(error.headers));
			core.debug(JSON.stringify(error.request));
			process.exit();
		}
	});

	const crx = new ChromeExtension({
		codebase: `https://github.com/${owner}/${repo}/releases/latest/download/SxDashPlus.crx`,
		privateKey: process.env.CRX_PEM,
	});

	const loaded = await crx.load(path.join(process.env.GITHUB_WORKSPACE, 'dist'));

	await core.group('Upload extension asset to release', async () => {
		try {
			const extensionBuffer = await loaded.pack();
			await octokit.repos.uploadReleaseAsset({
				url: upload_url,
				headers: {
					'content-type': 'application/x-chrome-extension',
					'content-length': extensionBuffer.length,
				},
				name: `SxDashPlus.crx`,
				data: extensionBuffer,
			});
		} catch (error) {
			core.setFailed(`Failed to upload release asset.`);
			core.error(error);
			process.exit();
		}
	});

	await core.group('Upload update asset to release', async () => {
		try {
			const extensionBuffer = await loaded.pack();
			await octokit.repos.uploadReleaseAsset({
				url: upload_url,
				headers: {
					'content-type': 'application/xml',
					'content-length': extensionBuffer.length,
				},
				name: `SxDashPlus.crx`,
				data: extensionBuffer,
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
