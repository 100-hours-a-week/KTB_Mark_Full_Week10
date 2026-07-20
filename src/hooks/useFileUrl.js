import { useEffect, useState } from "react";
import { getFile, fileUrl } from "../api/files.js";

export function useFileUrl(fileId) {
  const [url, setUrl] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fileId == null) {
      setUrl(undefined);
      setError(null);
      return;
    }

    let cancelled = false;
    setError(null);

    getFile(fileId)
      .then((result) => {
        if (!cancelled) {
          setUrl(fileUrl(result.data.filePath));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setUrl(undefined);
          setError(err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fileId]);

  return { url, error };
}
