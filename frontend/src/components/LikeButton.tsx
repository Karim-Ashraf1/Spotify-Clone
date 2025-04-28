import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { likeService } from '../services/likeService';
import { toast } from 'react-hot-toast';

interface LikeButtonProps {
  songId: string;
  initialLiked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onLikeChanged?: (isLiked: boolean) => void;
}

export default function LikeButton({ 
  songId, 
  initialLiked = false,
  size = 'md',
  className = '',
  onLikeChanged
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && songId && user) {
      const checkLikeStatus = async () => {
        try {
          const likeStatus = await likeService.checkLikeStatus(songId);
          setIsLiked(likeStatus);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };

      checkLikeStatus();
    }
  }, [songId, isSignedIn, user]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      
      if (isLiked) {
        await likeService.unlikeSong(songId);
        toast.success('Removed from your Liked Songs');
      } else {
        await likeService.likeSong(songId);
        toast.success('Added to your Liked Songs');
      }
      
      setIsLiked(!isLiked);
      if (onLikeChanged) {
        onLikeChanged(!isLiked);
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
      toast.error('Failed to update like status');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`focus:outline-none transition-colors ${className}`}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      disabled={isLoading}
    >
      <Heart
        className={`
          ${sizeClasses[size]} 
          ${isLiked ? 'fill-green-500 text-green-500' : 'text-gray-400 hover:text-white'} 
          transition-colors
          ${isLoading ? 'opacity-50' : ''}
        `}
      />
    </button>
  );
} 