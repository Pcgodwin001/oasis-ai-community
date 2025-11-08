import { useState, useEffect } from 'react';
import { Users, Heart, Share2, MessageCircle, Calendar, TrendingUp, Loader2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../contexts/UserContext';

interface CommunityPost {
  id: string;
  user_id: string;
  author_name: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_has_liked?: boolean;
}

interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export default function Community() {
  const { user, profile } = useUser();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);

  // Form states
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('success');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch posts from Supabase
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts by category
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === activeTab));
    }
  }, [activeTab, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which posts the current user has liked
      if (user) {
        const { data: likedPosts } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        const likedPostIds = new Set(likedPosts?.map(like => like.post_id) || []);

        const postsWithLikeStatus = data.map(post => ({
          ...post,
          user_has_liked: likedPostIds.has(post.id)
        }));

        setPosts(postsWithLikeStatus);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPostContent.trim()) return;

    try {
      setSubmitting(true);

      const authorName = profile?.full_name || user.user_metadata?.full_name || 'Anonymous';

      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          user_id: user.id,
          author_name: authorName,
          content: newPostContent,
          category: newPostCategory,
          likes_count: 0,
          comments_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Add new post to the list
      setPosts([data, ...posts]);

      // Reset form
      setNewPostContent('');
      setNewPostCategory('success');
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      alert('Please sign in to like posts');
      return;
    }

    try {
      if (currentlyLiked) {
        // Unlike the post
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Update likes_count
        const post = posts.find(p => p.id === postId);
        if (post) {
          const { error: updateError } = await supabase
            .from('community_posts')
            .update({ likes_count: Math.max(0, post.likes_count - 1) })
            .eq('id', postId);

          if (updateError) throw updateError;
        }
      } else {
        // Like the post
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert([{
            post_id: postId,
            user_id: user.id
          }]);

        if (insertError) throw insertError;

        // Update likes_count
        const post = posts.find(p => p.id === postId);
        if (post) {
          const { error: updateError } = await supabase
            .from('community_posts')
            .update({ likes_count: post.likes_count + 1 })
            .eq('id', postId);

          if (updateError) throw updateError;
        }
      }

      // Update local state
      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes_count: currentlyLiked ? post.likes_count - 1 : post.likes_count + 1,
              user_has_liked: !currentlyLiked
            }
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
      alert('Failed to like post. Please try again.');
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleOpenComments = async (post: CommunityPost) => {
    setSelectedPost(post);
    setIsCommentsDialogOpen(true);
    await fetchComments(post.id);
  };

  const handleAddComment = async () => {
    if (!user || !selectedPost || !newCommentContent.trim()) return;

    try {
      setSubmitting(true);

      const authorName = profile?.full_name || user.user_metadata?.full_name || 'Anonymous';

      const { data, error } = await supabase
        .from('post_comments')
        .insert([{
          post_id: selectedPost.id,
          user_id: user.id,
          author_name: authorName,
          content: newCommentContent
        }])
        .select()
        .single();

      if (error) throw error;

      // Add comment to local state
      setComments([...comments, data]);

      // Update comments_count
      const { error: updateError } = await supabase
        .from('community_posts')
        .update({ comments_count: selectedPost.comments_count + 1 })
        .eq('id', selectedPost.id);

      if (updateError) throw updateError;

      // Update local posts state
      setPosts(posts.map(post =>
        post.id === selectedPost.id
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ));

      setSelectedPost({ ...selectedPost, comments_count: selectedPost.comments_count + 1 });
      setNewCommentContent('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postDate.toLocaleDateString();
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'success': 'Success Story',
      'mutual-aid': 'Mutual Aid',
      'group-buy': 'Group Buy',
      'skills': 'Skill Share'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'success': 'bg-green-500',
      'mutual-aid': 'bg-blue-500',
      'group-buy': 'bg-purple-500',
      'skills': 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-lg font-semibold">Community Hub</h1>
            <p className="text-gray-600 text-sm">Connect, share, and support each other</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Members</span>
            <Users className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">147</p>
          <p className="text-gray-600 text-xs">In your area</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Active</span>
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">47</p>
          <p className="text-gray-600 text-xs">This week</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600 text-xs">Helped</span>
            <Heart className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-gray-900 text-2xl font-semibold">234</p>
          <p className="text-gray-600 text-xs">Families</p>
        </div>
      </div>

      {/* Share Story Button */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-sm h-9">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            Share Your Story
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Story</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="success">Success Story</SelectItem>
                  <SelectItem value="mutual-aid">Mutual Aid</SelectItem>
                  <SelectItem value="group-buy">Group Buy</SelectItem>
                  <SelectItem value="skills">Skill Share</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Your Story</label>
              <Textarea
                placeholder="Share your experience, tips, or request help from the community..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || submitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-white/60 backdrop-blur-lg p-1 rounded-xl border border-white/60">
          <TabsTrigger value="all" className="flex-1 rounded-lg text-[10px]">
            All
          </TabsTrigger>
          <TabsTrigger value="success" className="flex-1 rounded-lg text-[10px]">
            Success
          </TabsTrigger>
          <TabsTrigger value="mutual-aid" className="flex-1 rounded-lg text-[10px]">
            Mutual Aid
          </TabsTrigger>
          <TabsTrigger value="group-buy" className="flex-1 rounded-lg text-[10px]">
            Group Buy
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex-1 rounded-lg text-[10px]">
            Skills
          </TabsTrigger>
        </TabsList>

        {/* Posts Content */}
        <TabsContent value={activeTab} className="space-y-3 mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600 text-sm">{error}</p>
              <Button
                onClick={fetchPosts}
                variant="outline"
                className="mt-3"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-lg rounded-xl p-8 text-center border border-white/60">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-2">No posts yet in this category</p>
              <p className="text-gray-500 text-xs">Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/60 backdrop-blur-lg rounded-xl p-3 border border-white/60"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-gray-900 text-sm font-medium">{post.author_name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold text-white ${getCategoryColor(post.category)}`}>
                          {getCategoryLabel(post.category).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs">{formatTimeAgo(post.created_at)}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{post.content}</p>

                  <div className="flex items-center gap-4 text-xs">
                    <button
                      onClick={() => handleLikePost(post.id, post.user_has_liked || false)}
                      className={`flex items-center gap-1.5 ${
                        post.user_has_liked ? 'text-rose-500' : 'text-gray-600'
                      } hover:text-rose-500 transition-colors`}
                    >
                      <Heart
                        className={`w-4 h-4 ${post.user_has_liked ? 'fill-current' : ''}`}
                      />
                      <span>{post.likes_count}</span>
                    </button>
                    <button
                      onClick={() => handleOpenComments(post)}
                      className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments_count}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Comments Dialog */}
      <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              {/* Original Post */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-900 text-sm font-medium">{selectedPost.author_name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold text-white ${getCategoryColor(selectedPost.category)}`}>
                    {getCategoryLabel(selectedPost.category).toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-blue-500 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900 text-sm font-medium">{comment.author_name}</span>
                        <span className="text-gray-500 text-xs">{formatTimeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              {user ? (
                <div className="space-y-2 pt-3 border-t">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newCommentContent.trim() || submitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-3">Sign in to comment</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Community Guidelines */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <h3 className="text-gray-900 text-base font-semibold mb-3">Community Guidelines</h3>

        <div className="space-y-1.5 text-xs">
          <p className="text-gray-700">• Be respectful and kind to all members</p>
          <p className="text-gray-700">• Never share personal financial information</p>
          <p className="text-gray-700">• Report inappropriate behavior</p>
          <p className="text-gray-700">• Give back when you can - pay it forward</p>
          <p className="text-gray-700">• Anonymous posting is allowed and encouraged</p>
        </div>
      </div>
    </div>
  );
}
