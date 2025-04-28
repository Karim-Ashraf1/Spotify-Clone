import { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { Comment, User } from '../types';
import { useAuth, useUser } from '@clerk/clerk-react';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { Send, Trash2, Clock, MessageSquare } from 'lucide-react';

interface CommentSectionProps {
  albumId: string;
}

export default function CommentSection({ albumId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [replying, setReplying] = useState<string | null>(null);
  const [users, setUsers] = useState<{[key: string]: User}>({});
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (!albumId) return;

    const loadComments = async () => {
      try {
        setIsLoading(true);
        const commentsData = await commentService.getAlbumComments(albumId, sortOption);
        setComments(commentsData);
        
        const userIds = new Set<string>();
        commentsData.forEach(comment => {
          userIds.add(comment.userId);
          comment.replies?.forEach(reply => {
            userIds.add(reply.userId);
          });
        });
        
        const userDetailsMap: {[key: string]: User} = {};
        
        for (const userId of userIds) {
          try {
            const response = await axiosInstance.get(`/users/${userId}`);
            userDetailsMap[userId] = response.data as User;
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
          }
        }
        
        setUsers(userDetailsMap);
      } catch (error) {
        console.error('Error loading comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [albumId, sortOption]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setIsLoading(true);
      
      await commentService.addComment(
        albumId, 
        newComment, 
        replying || undefined
      );
      
      const updatedComments = await commentService.getAlbumComments(albumId, sortOption);
      setComments(updatedComments);
      
      setNewComment('');
      setReplying(null);
      
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!isSignedIn) return;
    
    try {
      setIsLoading(true);
      
      await commentService.deleteComment(commentId);
      
      setComments(prevComments => 
        prevComments.filter(comment => {
          if (comment._id === commentId) return false;
          
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply._id !== commentId);
          }
          
          return true;
        })
      );
      
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const commentUser = users[comment.userId];
    const isCurrentUser = user?.id === comment.userId;
    
    return (
      <div 
        key={comment._id} 
        className={`p-3 rounded-lg mb-2 ${isReply ? 'ml-8 bg-zinc-800' : 'bg-zinc-900'}`}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden"
            style={{ backgroundImage: commentUser?.imageUrl ? `url(${commentUser.imageUrl})` : 'none' }}
          >
            {!commentUser?.imageUrl && (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                {commentUser?.fullName?.charAt(0) || '?'}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium text-sm text-white">
                {commentUser?.fullName || 'Anonymous User'}
              </div>
              <div className="text-xs text-zinc-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(comment.createdAt)}
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-2 break-words">
              {comment.commentText}
            </p>
            
            <div className="flex items-center gap-3">
              {!isReply && (
                <button 
                  onClick={() => setReplying(replying === comment._id ? null : comment._id)}
                  className="text-xs text-zinc-400 hover:text-white flex items-center"
                  aria-label={replying === comment._id ? "Cancel reply" : "Reply to comment"}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {replying === comment._id ? 'Cancel' : 'Reply'}
                </button>
              )}
              
              {isCurrentUser && (
                <button 
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-xs text-zinc-400 hover:text-red-500 flex items-center ml-auto"
                  aria-label="Delete comment"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </button>
              )}
            </div>
            
            {replying === comment._id && (
              <form onSubmit={handleAddComment} className="mt-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 p-2 bg-zinc-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md flex-shrink-0"
                    aria-label="Submit reply"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 rounded-lg p-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Comments</h3>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as 'newest' | 'oldest')}
          className="bg-zinc-800 text-white px-3 py-1 rounded-md text-sm"
          aria-label="Sort comments"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
      
      {/* Comment Form */}
      {isSignedIn ? (
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-3 bg-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-md flex-shrink-0"
              aria-label="Post comment"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-4 bg-zinc-800 rounded-lg mb-6">
          <p className="text-zinc-300 mb-2">Sign in to join the conversation</p>
          <a 
            href="/sign-in" 
            className="inline-block bg-white text-black px-4 py-2 rounded-full font-medium"
          >
            Sign In
          </a>
        </div>
      )}
      
      {/* Comments List */}
      <div>
        {isLoading && comments.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-zinc-400 mt-2">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-6 text-zinc-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
} 