import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, Heart, MessageCircle, Send, Image, X } from "lucide-react";

interface Post {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  likes_count: number;
  created_at: string;
  user_name?: string;
  liked_by_me?: boolean;
  comments_count?: number;
}

const PostsPage = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!postsData) { setLoading(false); return; }

    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: users } = await supabase.from("users").select("id, full_name").in("id", userIds);
    const userMap = Object.fromEntries((users || []).map(u => [u.id, u.full_name]));

    const { data: likes } = await supabase.from("post_likes").select("post_id").eq("user_id", user!.id);
    const likedSet = new Set((likes || []).map(l => l.post_id));

    const { data: commentCounts } = await supabase.from("post_comments").select("post_id");
    const countMap: Record<string, number> = {};
    (commentCounts || []).forEach(c => { countMap[c.post_id] = (countMap[c.post_id] || 0) + 1; });

    setPosts(postsData.map(p => ({
      ...p,
      user_name: userMap[p.user_id] || "Unknown",
      liked_by_me: likedSet.has(p.id),
      comments_count: countMap[p.id] || 0,
    })));
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !file) return;
    setPosting(true);
    try {
      let media_url = null;
      let media_type = "image";
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `posts/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("media").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        media_url = urlData.publicUrl;
        media_type = file.type.startsWith("video") ? "video" : "image";
      }
      await supabase.from("posts").insert({
        user_id: user!.id,
        content: content.trim() || null,
        media_url,
        media_type,
      });
      setContent("");
      setFile(null);
      setPreview(null);
      fetchPosts();
    } catch (err: any) {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    }
    setPosting(false);
  };

  const toggleLike = async (post: Post) => {
    if (post.liked_by_me) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", user!.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: user!.id });
    }
    fetchPosts();
  };

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!data) return;
    const uIds = [...new Set(data.map(c => c.user_id))];
    const { data: users } = await supabase.from("users").select("id, full_name").in("id", uIds);
    const uMap = Object.fromEntries((users || []).map(u => [u.id, u.full_name]));
    setComments(prev => ({ ...prev, [postId]: data.map(c => ({ ...c, user_name: uMap[c.user_id] })) }));
  };

  const toggleComments = (postId: string) => {
    const next = !showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: next }));
    if (next) loadComments(postId);
  };

  const postComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    await supabase.from("post_comments").insert({ post_id: postId, user_id: user!.id, content: text });
    setCommentText(prev => ({ ...prev, [postId]: "" }));
    loadComments(postId);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-card/95 px-4 py-3 shadow-sm backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-secondary">{t("posts")}</h1>
      </div>
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      {/* Create post */}
      <div className="container mx-auto max-w-lg px-4 py-4">
        <Card className="border-2 border-border">
          <CardContent className="space-y-3 p-4">
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={t("write_post")}
              className="min-h-[80px] resize-none border-border font-body"
            />
            {preview && (
              <div className="relative">
                <img src={preview} alt="" className="max-h-48 rounded-lg object-cover" />
                <button onClick={() => { setFile(null); setPreview(null); }} className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-cream">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 font-body text-sm text-muted-foreground hover:bg-muted">
                <Image className="h-5 w-5" />
                {t("add_photo")}
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
              </label>
              <Button onClick={handlePost} disabled={posting || (!content.trim() && !file)} className="gap-2">
                <Send className="h-4 w-4" />
                {t("post")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="mt-4 space-y-4">
          {loading ? (
            <p className="text-center font-body text-muted-foreground">{t("loading")}</p>
          ) : posts.length === 0 ? (
            <p className="text-center font-body text-muted-foreground">{t("no_posts")}</p>
          ) : (
            posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden border-border">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 font-body text-sm font-bold text-primary">
                        {post.user_name?.[0]}
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold">{post.user_name}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {post.content && <p className="mb-3 font-body text-sm">{post.content}</p>}
                    {post.media_url && (
                      post.media_type === "video" ? (
                        <video src={post.media_url} controls className="mb-3 w-full rounded-lg" />
                      ) : (
                        <img src={post.media_url} alt="" className="mb-3 w-full rounded-lg object-cover" />
                      )
                    )}
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleLike(post)} className="flex items-center gap-1 font-body text-sm text-muted-foreground hover:text-primary">
                        <Heart className={`h-5 w-5 ${post.liked_by_me ? "fill-primary text-primary" : ""}`} />
                        {post.likes_count}
                      </button>
                      <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 font-body text-sm text-muted-foreground hover:text-primary">
                        <MessageCircle className="h-5 w-5" />
                        {post.comments_count}
                      </button>
                    </div>
                    {showComments[post.id] && (
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        {(comments[post.id] || []).map(c => (
                          <div key={c.id} className="flex gap-2">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-body text-xs font-bold">{c.user_name?.[0]}</div>
                            <div>
                              <span className="font-body text-xs font-semibold">{c.user_name}</span>
                              <p className="font-body text-xs">{c.content}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            value={commentText[post.id] || ""}
                            onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder={t("add_comment")}
                            className="h-8 text-xs"
                            onKeyDown={e => e.key === "Enter" && postComment(post.id)}
                          />
                          <Button size="sm" variant="ghost" onClick={() => postComment(post.id)}>
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
