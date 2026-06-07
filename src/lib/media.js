const getStorageBaseUrl = () =>
  process.env.NEXT_PUBLIC_STORAGE_URL
    ? process.env.NEXT_PUBLIC_STORAGE_URL.replace(/\/+$/, "").replace(/\/api$/, "")
    : "";

export const getStorageUrl = (path, fallback = "/placeholder.png") => {
  if (typeof path !== "string" || path.trim() === "") {
    return fallback;
  }

  const cleanPath = path.trim();

  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://") ||
    cleanPath.startsWith("data:") ||
    cleanPath.startsWith("blob:")
  ) {
    return cleanPath;
  }

  if (cleanPath.startsWith("/storage/")) {
    return `${getStorageBaseUrl()}${cleanPath}`;
  }

  if (cleanPath.startsWith("storage/")) {
    return `${getStorageBaseUrl()}/${cleanPath}`;
  }

  if (cleanPath.startsWith("/")) {
    return cleanPath;
  }

  return `${getStorageBaseUrl()}/storage/${cleanPath}`;
};
