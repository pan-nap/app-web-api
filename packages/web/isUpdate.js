import { exec } from 'node:child_process';
import fs from 'node:fs';

function run(cmd) {
	return new Promise((resolve, reject) => {
		const child = exec(cmd, (error, stdout) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout.trim());
			}
		});
		child.stdout.on('data', (data) => {
      console.log(data)
    })
		child.stderr.on('data', (err) => {
			console.log('err=>>>',err);
		});
	});
}

async function readFileSync(file) {
	const data = await fs.readFileSync(file, 'utf-8');
	return JSON.parse(data);
}

function getVsersion() {
	return fetch('https://huasuerp.com:7077/scmp-web/api/get_newest_npm_version')
		.then((res) => res.json())
		.then((res) => {
			const item = res.data?.attachList?.[0];
			if (!item) {
				return {
					version: null,
					path: 'hs-admin-ui@latest',
				};
			}
			const version = item.name.match(/-(\d+\.\d+\.\d+)\./)?.[1];
			return {
				version,
				path: 'https://oss-cn-beijing.hserp.cn/' + item.path,
			};
		});
}

async function main() {
	// await run('git pull');

	const [local1, HsAdminUi] = await Promise.all([
		readFileSync('./node_modules/hs-admin-ui/package.json'),
		getVsersion(),
	]);
	console.log('HsAdminUi=>>', HsAdminUi.version);
	if (HsAdminUi.version !== local1.version) {
		console.log('正在更新 hs-admin-ui ...');
		await run(`pnpm add ${HsAdminUi.path}`);
	}
	await run('vite --force');
}

main();
