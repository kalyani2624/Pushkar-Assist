import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Plus, CheckCircle, Image, X, Filter } from "lucide-react";

const CATEGORIES = ["luggage", "mobile", "gold", "children", "vehicles", "others"];

interface MissingItem {
  id: string;
  category: string;
  description: string;
  photo_url: string | null;
  lost_location: string | null;
  contact_number: string;
  address: string | null;
  is_found: boolean;
  created_at: string;
  user_id: string;
  user_name?: string;
}

const MissingItemsPage = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<MissingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: "luggage",
    description: "",
    lost_location: "",
    contact_number: "",
    address: "",
  });

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    fetchItems();
  }, [user]);

  const fetchItems = async () => {
    const { data } = await supabase.from("missing_items").select("*").eq("is_found", false).order("created_at", { ascending: false });
    if (!data) { setLoading(false); return; }
    const uIds = [...new Set(data.map(d => d.user_id))];
    const { data: users } = await supabase.from("users").select("id, full_name").in("id", uIds);
    const uMap = Object.fromEntries((users || []).map(u => [u.id, u.full_name]));
    setItems(data.map(d => ({ ...d, user_name: uMap[d.user_id] })));
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.description.trim() || !form.contact_number.trim()) {
      toast({ title: t("fill_required"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let photo_url = null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `missing/${Date.now()}.${ext}`;
        await supabase.storage.from("media").upload(path, file);
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        photo_url = urlData.publicUrl;
      }
      await supabase.from("missing_items").insert({
        user_id: user!.id,
        category: form.category,
        description: form.description.trim(),
        lost_location: form.lost_location.trim() || null,
        contact_number: form.contact_number.trim(),
        address: form.address.trim() || null,
        photo_url,
      });
      setShowForm(false);
      setForm({ category: "luggage", description: "", lost_location: "", contact_number: "", address: "" });
      setFile(null);
      setPreview(null);
      fetchItems();
      toast({ title: t("item_reported") });
    } catch (err: any) {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const markFound = async (id: string) => {
    await supabase.from("missing_items").update({ is_found: true }).eq("id", id);
    fetchItems();
  };

  const filtered = items.filter(i => {
    if (filterCat !== "all" && i.category !== filterCat) return false;
    if (searchText && !i.description.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-card/95 px-4 py-3 shadow-sm backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-secondary">{t("missing_items")}</h1>
        <Button size="sm" className="ml-auto gap-1" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> {t("report")}
        </Button>
      </div>
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      <div className="container mx-auto max-w-lg px-4 py-4 space-y-4">
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <Card className="border-2 border-primary/30">
              <CardHeader><CardTitle className="font-display text-lg">{t("report_missing")}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{t(`cat_${c}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea placeholder={t("description")} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                <Input placeholder={t("lost_location")} value={form.lost_location} onChange={e => setForm(p => ({ ...p, lost_location: e.target.value }))} />
                <Input placeholder={t("contact_number")} value={form.contact_number} onChange={e => setForm(p => ({ ...p, contact_number: e.target.value }))} />
                <Input placeholder={t("address")} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                {preview && (
                  <div className="relative inline-block">
                    <img src={preview} alt="" className="max-h-32 rounded-lg" />
                    <button onClick={() => { setFile(null); setPreview(null); }} className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-cream"><X className="h-3 w-3" /></button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Image className="h-4 w-4" /> {t("add_photo")}
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                  </label>
                  <Button onClick={handleSubmit} disabled={submitting}>{t("submit")}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("search")} value={searchText} onChange={e => setSearchText(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-[140px]"><Filter className="mr-1 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{t(`cat_${c}`)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Items list */}
        {loading ? (
          <p className="text-center font-body text-muted-foreground">{t("loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center font-body text-muted-foreground">{t("no_items")}</p>
        ) : (
          filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-border">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-semibold text-primary">{t(`cat_${item.category}`)}</span>
                    <span className="font-body text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  {item.photo_url && <img src={item.photo_url} alt="" className="w-full rounded-lg object-cover max-h-48" />}
                  <p className="font-body text-sm">{item.description}</p>
                  {item.lost_location && <p className="font-body text-xs text-muted-foreground">📍 {item.lost_location}</p>}
                  <p className="font-body text-xs text-muted-foreground">📞 {item.contact_number}</p>
                  <p className="font-body text-xs text-muted-foreground">{t("reported_by")}: {item.user_name}</p>
                  {item.user_id === user?.id && (
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => markFound(item.id)}>
                      <CheckCircle className="h-4 w-4" /> {t("mark_found")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MissingItemsPage;
