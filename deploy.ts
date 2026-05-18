/* eslint-disable no-console, unicorn/prevent-abbreviations, antfu/no-top-level-await */
import { readFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { env } from "node:process";

import Session, { ApiErrors } from "m3api";
// @ts-expect-error - m3api-botpassword doesn't have types.
import { login } from "m3api-botpassword";

const distDir = join(import.meta.dirname, "dist");

const username = env.MEDIAWIKI_USERNAME;
const password = env.MEDIAWIKI_PASSWORD;

if (!username || !password) {
	throw new Error("MEDIAWIKI_USERNAME and MEDIAWIKI_PASSWORD must be set");
}

interface PushCommit {
	id: string;
	message: string;
	author: { name: string; username?: string };
	url: string;
}

function loadCommits(): Array<PushCommit> {
	const eventPath = env.GITHUB_EVENT_PATH;
	if (!eventPath) return [];

	const event = JSON.parse(readFileSync(eventPath, "utf8")) as {
		commits?: Array<PushCommit>;
		head_commit?: PushCommit;
	};

	if (Array.isArray(event.commits) && event.commits.length > 0) return event.commits;
	if (event.head_commit) return [event.head_commit];
	return [];
}

function buildSummary(): string {
	const commits = loadCommits();
	if (commits.length === 0) return "Automated build upload.";

	const parts = commits.map((commit) => {
		const subject = commit.message.split("\n")[0]!.trim();
		return `${subject} (${commit.url})`;
	});

	const summary = parts.join("; ");
	// MediaWiki edit summaries are capped at ~1000 bytes; keep some headroom.
	return summary.length > 800 ? `${summary.slice(0, 797)}...` : summary;
}

const summary = buildSummary();

class VRChatWikiSession extends Session {
	public getFetchOptions({ headers, ...fetchOptions }: any) {
		return super.getFetchOptions({
			...fetchOptions,
			headers: {
				...headers,
				"x-vrc-waf-pls-let-me-in": env.BYPASS_TOKEN
			}
		});
	}
}

const session = new VRChatWikiSession(
	"https://wiki.vrchat.com/api.php",
	{ formatversion: 2, errorformat: "plaintext" },
	{ userAgent: "wiki.vrchat.com upload (https://github.com/vrchat-community/wiki-scripts)" }
);

await login(session, username, password);

const files = await readdir(distDir);

for (const file of files) {
	const text = await readFile(join(distDir, file), "utf8");

	try {
		await session.request(
			{ action: "edit", title: file, text, bot: true, summary },
			{ method: "POST", tokenType: "csrf" }
		);
		console.log(`uploaded ${file}`);
	}
	catch (reason) {
		if (reason instanceof ApiErrors) {
			console.error(`failed ${file}: ${reason.errors.map((e) => e.code).join(", ")}`);
		}
		throw reason;
	}
}
