import axiosInstance from '../utility/axiosInstance';
import {getComments, handleError} from '../actions/chat-noti';

export const useComment = ({comment}) => {
  const deleteComment = () => {
    axiosInstance
      .delete(`/content/comment/delete/${comment._id}`)
      .then(res => {
        if (res.data.success) {
          getComments(comment.contentId);
        }
      })
      .catch(error => {
        handleError(error);
      });
  };

  const handleUpdateComment = commentText => {
    axiosInstance
      .patch(`content/comment/update/${comment._id}`, {
        comment: commentText,
        contentId: comment.contentId,
      })
      .then(res => {
        if (res.data.success) {
          getComments(comment.contentId);
          // getReplies();
        }
      })
      .catch(error => {
        handleError(error);
      });
  };
  const getReplies = () => {
    axiosInstance
      .get(
        `/content/comment/get/${comment?.contentId}?parentId=${comment.parentId}`,
      )
      .then(res => {
        // setReplies(res?.data?.comments || []);
      })
      .catch(error => {
        handleError(error);
      });
  };
  return {deleteComment, handleUpdateComment, getReplies};
};
