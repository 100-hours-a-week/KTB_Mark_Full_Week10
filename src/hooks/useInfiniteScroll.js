import { useCallback, useEffect, useRef, useState } from "react";

export function useInfiniteScroll(fetchPage) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const lastPostIdRef = useRef(null);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const loadPosts = useCallback(() => {
    if (isLoadingRef.current || !hasMoreRef.current) {
      return;
    }
    isLoadingRef.current = true;
    setIsLoading(true);

    fetchPage(lastPostIdRef.current)
      .then((result) => {
        const { total, list } = result.data;

        if (total === 0 && lastPostIdRef.current === null) {
          setIsEmpty(true);
          hasMoreRef.current = false;
          setHasMore(false);
          return;
        }

        if (total < 10) {
          hasMoreRef.current = false;
          setHasMore(false);
        }

        if (list.length > 0) {
          lastPostIdRef.current = list[list.length - 1].postId;
        }

        setPosts((prev) => [...prev, ...list]);
      })
      .finally(() => {
        isLoadingRef.current = false;
        setIsLoading(false);
      });
  }, [fetchPage]);

  useEffect(() => {
    lastPostIdRef.current = null;
    isLoadingRef.current = false;
    hasMoreRef.current = true;
    setPosts([]);
    setHasMore(true);
    setIsEmpty(false);
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (hasMoreRef.current && document.body.scrollHeight <= window.innerHeight) {
      loadPosts();
    }
  }, [posts, loadPosts]);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
        loadPosts();
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadPosts]);

  return { posts, isLoading, hasMore, isEmpty };
}
