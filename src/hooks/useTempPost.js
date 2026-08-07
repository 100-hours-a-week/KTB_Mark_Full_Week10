import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { autoSaveTempPost, createTempPost, getTempPost } from "../api/posts.js";

const AUTO_SAVE_INTERVAL_MS = 30000;

export function useTempPost() {
  const navigate = useNavigate();
  const [tempPostId, setTempPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [needsResumeChoice, setNeedsResumeChoice] = useState(false);

  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  const creatingRef = useRef(false);
  const titleRef = useRef(title);
  const bodyRef = useRef(body);
  const categoryRef = useRef(category);
  titleRef.current = title;
  bodyRef.current = body;
  categoryRef.current = category;

  const startInterval = useCallback((id) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      autoSaveTempPost(id, titleRef.current, bodyRef.current, categoryRef.current);
    }, AUTO_SAVE_INTERVAL_MS);
  }, []);

  const createTemp = useCallback(() => {
    if (creatingRef.current) {
      return;
    }
    creatingRef.current = true;
    createTempPost()
      .then((result) => {
        creatingRef.current = false;
        if (!mountedRef.current) {
          return;
        }
        const id = result.data.postId;
        localStorage.setItem("tempPostId", id);
        setTempPostId(id);
        startInterval(id);
      })
      .catch((error) => {
        creatingRef.current = false;
        if (!mountedRef.current) {
          return;
        }
        if (error.status === 401) {
          navigate("/login", { replace: true });
        }
      });
  }, [navigate, startInterval]);

  useEffect(() => {
    mountedRef.current = true;
    const existing = localStorage.getItem("tempPostId");
    if (existing != null) {
      setTempPostId(existing);
      setNeedsResumeChoice(true);
    } else {
      createTemp();
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  function resume() {
    setNeedsResumeChoice(false);
    getTempPost(tempPostId).then((result) => {
      if (!mountedRef.current) {
        return;
      }
      setTitle(result.data.title);
      setBody(result.data.body);
      setCategory(result.data.category || "");
      startInterval(tempPostId);
    });
  }

  function startFresh() {
    setNeedsResumeChoice(false);
    localStorage.removeItem("tempPostId");
    createTemp();
  }

  function stopAutoSave() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function clearTempPost() {
    localStorage.removeItem("tempPostId");
  }

  return {
    tempPostId,
    title,
    setTitle,
    body,
    setBody,
    category,
    setCategory,
    needsResumeChoice,
    resume,
    startFresh,
    stopAutoSave,
    clearTempPost,
  };
}
