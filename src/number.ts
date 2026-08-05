/** Number formatting utilities. */

/** Converts bytes to a human-readable size string (KiB, MiB, etc). */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (!Number(bytes) || bytes === 0) {
    return "0 Bytes";
  }

  const kbToBytes = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const index = Math.floor(Math.log(bytes) / Math.log(kbToBytes));

  return `${parseFloat((bytes / Math.pow(kbToBytes, index)).toFixed(dm))} ${
    sizes[index]
  }`;
};

/** Formats a number as a fixed-point decimal string. */
export const formatNumber = (x = 0, d = 2): string => {
  return parseFloat(String(x)).toFixed(d);
};
