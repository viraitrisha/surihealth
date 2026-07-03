import { n as resolveModuleURL } from "./_libs/exsolve.mjs";
import { a as basename, c as join, d as resolve, i as parseNodeModulePath, l as normalize, n as lookupNodeModuleSubpath, o as dirname, r as normalizeid, s as isAbsolute$1, t as isValidNodeImport, u as relative } from "./_libs/mlly.mjs";
import "./_libs/confbox.mjs";
import { n as writePackageJSON, t as readPackageJSON } from "./_libs/pkg-types.mjs";
import { existsSync, promises } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { stat } from "node:fs/promises";
import { extname } from "node:path";
import { platform } from "node:os";
import { nodeFileTrace } from "@vercel/nft";
import semver from "semver";

//#region src/trace.ts
async function traceNodeModules(input, opts) {
	await opts?.hooks?.traceStart?.(input);
	const traceResult = await nodeFileTrace([...input], {
		conditions: (opts.exportConditions || [
			"node",
			"import",
			"default"
		]).filter((c) => ![
			"require",
			"import",
			"default"
		].includes(c)),
		...opts.traceOptions
	});
	await opts?.hooks?.traceResult?.(traceResult);
	const _resolveTracedPath = (p) => promises.realpath(resolve(opts.traceOptions?.base || ".", p));
	const tracedFiles = Object.fromEntries(await Promise.all([...traceResult.reasons.entries()].map(async ([_path, reasons]) => {
		if (reasons.ignored) return;
		const path$1 = await _resolveTracedPath(_path);
		if (!path$1.includes("node_modules")) return;
		if (!await isFile(path$1)) return;
		const { dir: baseDir, name: pkgName, subpath } = parseNodeModulePath(path$1);
		if (!baseDir || !pkgName) return;
		const pkgPath = join(baseDir, pkgName);
		return [path$1, {
			path: path$1,
			parents: await Promise.all([...reasons.parents].map((p) => _resolveTracedPath(p))),
			subpath,
			pkgName,
			pkgPath
		}];
	})).then((r) => r.filter(Boolean)));
	await opts?.hooks?.tracedFiles?.(tracedFiles);
	const tracedPackages = {};
	for (const tracedFile of Object.values(tracedFiles)) {
		const pkgName = tracedFile.pkgName;
		let tracedPackage = tracedPackages[pkgName];
		let pkgJSON = await readPackageJSON(tracedFile.pkgPath, { cache: true }).catch(() => {});
		if (!pkgJSON) pkgJSON = {
			name: pkgName,
			version: "0.0.0"
		};
		if (!tracedPackage) {
			tracedPackage = {
				name: pkgName,
				versions: {}
			};
			tracedPackages[pkgName] = tracedPackage;
		}
		let tracedPackageVersion = tracedPackage.versions[pkgJSON.version || "0.0.0"];
		if (!tracedPackageVersion) {
			tracedPackageVersion = {
				path: tracedFile.pkgPath,
				files: [],
				pkgJSON
			};
			tracedPackage.versions[pkgJSON.version || "0.0.0"] = tracedPackageVersion;
		}
		tracedPackageVersion.files.push(tracedFile.path);
		tracedFile.pkgName = pkgName;
		if (pkgJSON.version) tracedFile.pkgVersion = pkgJSON.version;
	}
	await opts?.hooks?.tracedPackages?.(tracedPackages);
	const usedAliases = {};
	const outDir = resolve(opts.rootDir || ".", opts.outDir || "dist", "node_modules");
	const writePackage = async (name, version, _pkgPath) => {
		const pkg = tracedPackages[name];
		const pkgPath = _pkgPath || pkg.name;
		for (const src of pkg.versions[version].files) {
			const { subpath } = parseNodeModulePath(src);
			if (!subpath) continue;
			const dst = resolve(outDir, pkgPath, subpath);
			await promises.mkdir(dirname(dst), { recursive: true });
			const transformers = (opts.transform || []).filter((t) => t?.filter?.(src) && t.handler);
			if (transformers.length > 0) {
				let content = await promises.readFile(src, "utf8");
				for (const transformer of transformers) content = await transformer.handler(content, src) ?? content;
				await promises.writeFile(dst, content, "utf8");
			} else await promises.copyFile(src, dst);
			if (opts.chmod) await promises.chmod(dst, opts.chmod === true ? 420 : opts.chmod);
		}
		const pkgJSON = pkg.versions[version].pkgJSON;
		applyProductionCondition(pkgJSON.exports);
		const pkgJSONPath = join(outDir, pkgPath, "package.json");
		await promises.mkdir(dirname(pkgJSONPath), { recursive: true });
		await promises.writeFile(pkgJSONPath, JSON.stringify(pkgJSON, null, 2), "utf8");
		if (opts.traceAlias && opts.traceAlias[pkgPath]) {
			usedAliases[opts.traceAlias[pkgPath]] = version;
			await linkPackage(pkgPath, opts.traceAlias[pkgPath]);
		}
	};
	const isWindows = platform() === "win32";
	const linkPackage = async (from, to) => {
		const src = join(outDir, from);
		const dst = join(outDir, to);
		if ((await promises.lstat(dst).catch(() => null))?.isSymbolicLink()) return;
		await promises.mkdir(dirname(dst), { recursive: true });
		await promises.symlink(relative(dirname(dst), src), dst, isWindows ? "junction" : "dir").catch((error) => {
			if (error.code !== "EEXIST") console.error("Cannot link", from, "to", to, error);
		});
	};
	const findPackageParents = (pkg, version) => {
		const versionFiles = pkg.versions[version].files.map((path$1) => tracedFiles[path$1]);
		return [...new Set(versionFiles.flatMap((file) => file.parents.map((parentPath) => {
			const parentFile = tracedFiles[parentPath];
			if (!parentFile || parentFile.pkgName === pkg.name) return null;
			return `${parentFile.pkgName}@${parentFile.pkgVersion}`;
		}).filter(Boolean)))];
	};
	const multiVersionPkgs = {};
	const singleVersionPackages = [];
	for (const tracedPackage of Object.values(tracedPackages)) {
		const versions = Object.keys(tracedPackage.versions);
		if (versions.length === 1) {
			singleVersionPackages.push(tracedPackage.name);
			continue;
		}
		multiVersionPkgs[tracedPackage.name] = {};
		for (const version of versions) multiVersionPkgs[tracedPackage.name][version] = findPackageParents(tracedPackage, version);
	}
	await Promise.all(singleVersionPackages.map((pkgName) => {
		const pkg = tracedPackages[pkgName];
		const version = Object.keys(pkg.versions)[0];
		return writePackage(pkgName, version);
	}));
	for (const [pkgName, pkgVersions] of Object.entries(multiVersionPkgs)) {
		const versionEntries = Object.entries(pkgVersions).sort(([v1, p1], [v2, p2]) => {
			if (p1.length === 0) return -1;
			if (p2.length === 0) return 1;
			return compareVersions(v1, v2);
		});
		for (const [version, parentPkgs] of versionEntries) {
			await writePackage(pkgName, version, `.nf3/${pkgName}@${version}`);
			await linkPackage(`.nf3/${pkgName}@${version}`, `${pkgName}`);
			for (const parentPkg of parentPkgs) {
				const parentPkgName = parentPkg.replace(/@[^@]+$/, "");
				await (multiVersionPkgs[parentPkgName] ? linkPackage(`.nf3/${pkgName}@${version}`, `.nf3/${parentPkg}/node_modules/${pkgName}`) : linkPackage(`.nf3/${pkgName}@${version}`, `${parentPkgName}/node_modules/${pkgName}`));
			}
		}
	}
	if (opts.writePackageJson) await writePackageJSON(resolve(outDir, "../package.json"), {
		name: "traced-node-modules",
		version: "1.0.0",
		type: "module",
		private: true,
		dependencies: Object.fromEntries([...Object.values(tracedPackages).map((pkg) => [pkg.name, Object.keys(pkg.versions)[0]]), ...Object.entries(usedAliases)].sort(([a], [b]) => a.localeCompare(b)))
	});
}
function compareVersions(v1 = "0.0.0", v2 = "0.0.0") {
	try {
		return semver.lt(v1, v2, { loose: true }) ? 1 : -1;
	} catch {
		return v1.localeCompare(v2);
	}
}
function applyProductionCondition(exports) {
	if (!exports || typeof exports === "string" || Array.isArray(exports)) return;
	if ("production" in exports) if (typeof exports.production === "string") exports.default = exports.production;
	else Object.assign(exports, exports.production);
	for (const key in exports) applyProductionCondition(exports[key]);
}
async function isFile(file) {
	try {
		return (await promises.stat(file)).isFile();
	} catch (error) {
		if (error?.code === "ENOENT") return false;
		throw error;
	}
}

//#endregion
//#region src/plugin.ts
function rollupNodeFileTrace(opts = {}) {
	const trackedExternals = /* @__PURE__ */ new Set();
	const moduleDirectories = opts.moduleDirectories || [resolve(opts.rootDir || ".", "node_modules") + "/"];
	const tryResolve = (id, importer) => {
		if (id.startsWith("\0")) return id;
		const from = importer ? [isAbsolute$1(importer) ? pathToFileURL(importer) : importer] : moduleDirectories;
		const extensions = extname(id) ? [] : [
			".mjs",
			".cjs",
			".js",
			".mts",
			".cts",
			".ts",
			".json"
		];
		for (const dir of from) {
			const res = resolveModuleURL(id, {
				try: true,
				from: dir,
				extensions,
				suffixes: ["", "/index"],
				conditions: opts.exportConditions
			});
			if (res) return res.startsWith("file://") ? fileURLToPath(res) : res;
		}
	};
	const inlineMatchers = (opts.inline || []).map((p) => normalizeMatcher(p)).sort((a, b) => (b.score || 0) - (a.score || 0));
	const externalMatchers = (opts.external || []).map((p) => normalizeMatcher(p)).sort((a, b) => (b.score || 0) - (a.score || 0));
	const isExplicitInline = (id, importer) => {
		if (id.startsWith("\0")) return true;
		const inlineMatch = inlineMatchers.find((m) => m(id, importer));
		const externalMatch = externalMatchers.find((m) => m(id, importer));
		if (inlineMatch && (!externalMatch || externalMatch && (inlineMatch.score || 0) > (externalMatch.score || 0))) return true;
	};
	return {
		name: "nf3",
		resolveId: {
			order: "pre",
			async handler(originalId, importer, options) {
				if (!originalId || originalId.startsWith("\0") || originalId.includes("?") || originalId.startsWith("#")) return null;
				if (originalId.startsWith(".")) return null;
				if (/^[a-z0-9]{2,}:/i.test(originalId)) return null;
				if (importer && /\.d\.[mc]?[jt]s$/.test(basename(importer))) return null;
				const id = normalize(originalId);
				if (isExplicitInline(id, importer)) return null;
				const resolved = await this.resolve(originalId, importer, options) || { id };
				if (isExplicitInline(resolved.id, importer)) return null;
				if (!isAbsolute$1(resolved.id) || !existsSync(resolved.id) || await isDirectory(resolved.id)) resolved.id = tryResolve(resolved.id, importer) || resolved.id;
				if (!await isValidNodeImport(resolved.id).catch(() => false)) return null;
				if (opts.noTrace) return {
					...resolved,
					id: isAbsolute$1(resolved.id) ? normalizeid(resolved.id) : resolved.id,
					external: true
				};
				const { name: pkgName } = parseNodeModulePath(resolved.id);
				if (!pkgName) return null;
				if (pkgName !== originalId) {
					if (!isAbsolute$1(originalId)) {
						const fullPath = tryResolve(originalId, importer);
						if (fullPath) {
							trackedExternals.add(fullPath);
							return {
								id: originalId,
								external: true
							};
						}
					}
					if (tryResolve(pkgName, importer) !== id) {
						const guessedSubpath = await lookupNodeModuleSubpath(id).catch(() => null);
						const resolvedGuess = guessedSubpath && tryResolve(join(pkgName, guessedSubpath), importer);
						if (resolvedGuess === id) {
							trackedExternals.add(resolvedGuess);
							return {
								id: join(pkgName, guessedSubpath),
								external: true
							};
						}
						return null;
					}
				}
				trackedExternals.add(resolved.id);
				return {
					id: pkgName,
					external: true
				};
			}
		},
		buildEnd: {
			order: "post",
			async handler() {
				if (opts.noTrace) return;
				for (const pkgName of opts.traceInclude || []) {
					const path$1 = await this.resolve(pkgName);
					if (path$1?.id) trackedExternals.add(path$1.id.replace(/\?.+/, ""));
				}
				await traceNodeModules([...trackedExternals], opts);
			}
		}
	};
}
function normalizeMatcher(input) {
	if (typeof input === "function") {
		input.score = input.score ?? 1e4;
		return input;
	}
	if (input instanceof RegExp) {
		const matcher = ((id) => input.test(id));
		matcher.score = input.toString().length;
		Object.defineProperty(matcher, "name", { value: `match(${input})` });
		return matcher;
	}
	if (typeof input === "string") {
		const pattern = normalize(input);
		const matcher = ((id) => {
			const idWithoutNodeModules = id.split("node_modules/").pop();
			return id.startsWith(pattern) || idWithoutNodeModules?.startsWith(pattern);
		});
		matcher.score = input.length;
		if (!isAbsolute$1(input) && input[0] !== ".") matcher.score += 1e3;
		Object.defineProperty(matcher, "name", { value: `match(${pattern})` });
		return matcher;
	}
	throw new Error(`Invalid matcher or pattern: ${input}`);
}
async function isDirectory(path$1) {
	try {
		return (await stat(path$1)).isDirectory();
	} catch {
		return false;
	}
}

//#endregion
export { rollupNodeFileTrace, traceNodeModules };