import fs from 'node:fs';
import ts from 'typescript';
const cache = new Map();
async function moduleUrl(url) {
  if (cache.has(url.href)) return cache.get(url.href);
  let source = ts.transpileModule(fs.readFileSync(url, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  for (const match of source.matchAll(/from (['"])([^'"]+)\1/g)) {
    const name = match[2];
    let resolved;
    if (name.startsWith('.')) {
      let child = new URL(name, url);
      if (!fs.existsSync(child)) {
        child = new URL(`${name}.ts`, url);
        if (!fs.existsSync(child)) child = new URL(`${name}.tsx`, url);
      }
      resolved = await moduleUrl(child);
    } else resolved = import.meta.resolve(name);
    source = source.replace(match[0], `from ${JSON.stringify(resolved)}`);
  }
  const data = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  cache.set(url.href, data);
  return data;
}
export async function loadSource(relative) {
  return import(await moduleUrl(new URL(relative, import.meta.url)));
}
