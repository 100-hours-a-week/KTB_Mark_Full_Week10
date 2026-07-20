import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth.js";
import { createComment, deleteComment, listComments, updateComment } from "../api/comments.js";

export function useComments(postId) {
  const { setUserRole } = useAuth();
  const [comments, setComments] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const reload = useCallback(() => {
    return listComments(postId).then((result) => {
      setComments(result.data);
    });
  }, [postId]);

  useEffect(() => {
    let cancelled = false;
    listComments(postId).then((result) => {
      if (!cancelled) {
        setComments(result.data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const submitComment = useCallback(
    (text, parentCommentId) => {
      if (!text.trim()) {
        return Promise.resolve();
      }
      return createComment(postId, text, parentCommentId).then((result) => {
        setUserRole(result.data.userRole);
        return reload();
      });
    },
    [postId, reload, setUserRole],
  );

  const editComment = useCallback(
    (commentId, text) => {
      return updateComment(commentId, text).then(() => reload());
    },
    [reload],
  );

  const requestDelete = useCallback((commentId) => {
    setDeleteTargetId(commentId);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const confirmDelete = useCallback(() => {
    return deleteComment(deleteTargetId).then(() => {
      setDeleteTargetId(null);
      return reload();
    });
  }, [deleteTargetId, reload]);

  return {
    comments,
    submitComment,
    editComment,
    requestDelete,
    cancelDelete,
    confirmDelete,
    deleteTargetId,
  };
}
