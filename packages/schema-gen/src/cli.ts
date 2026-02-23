#!/usr/bin/env node
/**
 * sdaas-schema-gen CLI
 *
 * Usage:
 *   sdaas-schema-gen --name my_dataset --fields id:uuid,amount:float,status:enum --rows 50000
 *
 * Flags:
 *   --name    Dataset name (required)
 *   --fields  Comma-separated field specs: name:type or name:enum:val1|val2|val3
 *   --rows    Approximate row count
 *   --out     Output file path (default: stdout)
 */

import fs from "fs";
import { generateManifestScaffold } from "./index.js";
import type { FieldSpec } from "./types.js";

function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function parseFields(raw: string): FieldSpec[] {
  return raw.split(",").map((part) => {
    const segments = part.trim().split(":");
    const name = segments[0];
    const type = (segments[1] ?? "string") as FieldSpec["type"];
    const valuesPart = segments[2];
    return {
      name,
      type,
      values: valuesPart ? valuesPart.split("|") : undefined,
    };
  });
}

const name = getArg("--name");
if (!name) {
  console.error("Error: --name is required");
  process.exit(1);
}

const fieldsRaw = getArg("--fields") ?? "";
const rows = getArg("--rows");
const outPath = getArg("--out");

const scaffold = generateManifestScaffold({
  datasetName: name,
  rowCount: rows ? parseInt(rows, 10) : undefined,
  fields: fieldsRaw ? parseFields(fieldsRaw) : [],
});

const json = JSON.stringify(scaffold, null, 2) + "\n";

if (outPath) {
  fs.writeFileSync(outPath, json, "utf8");
  console.error(`Written to ${outPath}`);
} else {
  process.stdout.write(json);
}
