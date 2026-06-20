import { put } from "@vercel/blob"
import { readFile } from "node:fs/promises"

const data = await readFile("public/downloads/kids-summer-camp.zip")
const blob = await put("downloads/kids-summer-camp.zip", data, {
  access: "private",
  contentType: "application/zip",
  allowOverwrite: true,
})
console.log("BLOB_PATHNAME:", blob.pathname)
