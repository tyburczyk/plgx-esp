/**
 * Takes the number of Bytes and returns a human readable representation
 */
function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  let base = 1024;
  let sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let i = Math.floor(Math.log(bytes) / Math.log(base));

  let amount = (bytes / Math.pow(base, i)).toFixed(2);

  return parseFloat(amount) + " " + sizes[i];
}

export default formatBytes;
