import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Send,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { ForumPost } from '../types';

interface CommunityForumViewProps {
  posts: ForumPost[];
  onUpvotePost: (id: string) => Promise<void>;
  onAddComment: (postId: string, text: string) => Promise<void>;
  onCreatePost: (postData: { title: string; content: string; category: string; tags: string[] }) => Promise<void>;
}

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({
  posts,
  onUpvotePost,
  onAddComment,
  onCreatePost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Solid Waste Management');
  const [newTags, setNewTags] = useState('CivicResilience, BarangayAction');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  const categories = [
    'All',
    'Solid Waste Management',
    'Water Resource Protection',
    'Climate Vulnerability',
    'Flood Resilience',
    'Energy Efficiency',
  ];

  const filteredPosts = posts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter((t) => t.length > 0);
      await onCreatePost({
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        tags: tagsArray,
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white text-slate-900 rounded-3xl p-5 shadow-xs border border-emerald-200/90">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-black text-xl font-display tracking-tight text-emerald-950">
              Community Climate Forum
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              Discuss local ecological solutions, waste segregation drives, and barangay flood mitigation with fellow citizens.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start Thread</span>
          </button>
        </div>
      </div>

      {/* Forum Content Grid (Responsive on lg/xl) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Filter and Search Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4 lg:sticky lg:top-20">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Discussion Topics
            </span>
            <div className="flex flex-wrap lg:flex-col gap-1.5 text-xs">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedCategory === c
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{c}</span>
                  {selectedCategory === c && <span className="text-emerald-200 text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full hidden lg:flex items-center justify-center gap-1.5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discussion Thread</span>
          </button>
        </div>

        {/* Right Column: Forum Thread Cards Feed */}
        <div className="lg:col-span-8 space-y-3.5">
          {filteredPosts.map((post) => {

          const isCommentsOpen = activeCommentPostId === post.id;

          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-all"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-semibold">
                        {post.authorRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Brgy. {post.barangay} · {post.createdAt}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {post.category}
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-emerald-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => onUpvotePost(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    post.upvotedByUser
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${post.upvotedByUser ? 'fill-emerald-800' : ''}`} />
                  <span className="tabular-nums">{post.upvotes} Upvotes</span>
                </button>

                <button
                  onClick={() =>
                    setActiveCommentPostId(isCommentsOpen ? null : post.id)
                  }
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{post.comments.length} Comments</span>
                </button>
              </div>

              {/* Expandable Comments Drawer */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50/50 p-3 rounded-xl animate-in fade-in">
                  <div className="space-y-2">
                    {post.comments.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white p-2.5 rounded-xl border border-slate-200/70 text-xs text-slate-800 space-y-0.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900">{c.author}</span>
                          <span className="text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-700 leading-snug">{c.text}</p>
                      </div>
                    ))}
                    {post.comments.length === 0 && (
                      <p className="text-xs text-slate-500 italic text-center py-2">
                        No comments yet. Share your experience or insights!
                      </p>
                    )}
                  </div>

                  {/* Add comment input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommentSubmit(post.id);
                      }}
                      placeholder="Add a comment to this thread (+10 Eco-Points)..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-colors cursor-pointer"
                      title="Send comment"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Create Discussion Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 font-display">
                Create Community Forum Discussion
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Barangay Central Community Composting Depot Launch"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Climate Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {categories
                    .filter((c) => c !== 'All')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Discussion Narrative *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details, schedules, tips, or inquiries for fellow barangay residents..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Hashtags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. ZeroWaste, FloodResilience, Compost"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSubmittingPost ? 'Publishing...' : 'Publish Thread (+25 Eco-Points)'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
