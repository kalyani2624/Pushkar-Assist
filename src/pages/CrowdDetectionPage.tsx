import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

const GHATS = [
  { id: "saraswati", name_en: "Saraswati Ghat", name_te: "సరస్వతి ఘాట్", name_hi: "सरस्वती घाट" },
  { id: "pushkara", name_en: "Pushkara Ghat", name_te: "పుష్కర ఘాట్", name_hi: "पुष्कर घाट" },
  { id: "padmavati", name_en: "Padmavati Ghat", name_te: "పద్మావతి ఘాట్", name_hi: "पद्मावती घाट" },
  { id: "dhobi", name_en: "Dhobi Ghat", name_te: "ధోబీ ఘాట్", name_hi: "धोबी घाट" },
  { id: "temple", name_en: "Temple Area", name_te: "ఆలయ ప్రాంతం", name_hi: "मंदिर क्षेत्र" },
  { id: "boat", name_en: "Boat Ride Point", name_te: "బోట్ రైడ్ పాయింట్", name_hi: "नौका विहार स्थल" },
];

const LEVELS = [
  { value: "low", color: "bg-green-500", icon: CheckCircle, label_en: "Low", label_te: "తక్కువ", label_hi: "कम" },
  { value: "medium", color: "bg-yellow-500", icon: AlertTriangle, label_en: "Medium", label_te: "మధ్యస్థం", label_hi: "मध्यम" },
  { value: "high", color: "bg-red-500", icon: AlertCircle, label_en: "High", label_te: "ఎక్కువ", label_hi: "अधिक" },
];

const CrowdDetectionPage = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [crowdData, setCrowdData] = useState<Record<string, string>>({});
  const [reportGhat, setReportGhat] = useState(GHATS[0].id);
  const [reportLevel, setReportLevel] = useState("medium");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    fetchCrowdData();

    const channel = supabase
      .channel("crowd_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "crowd_reports" }, () => fetchCrowdData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchCrowdData = async () => {
    // Get latest report for each ghat
    const { data } = await supabase
      .from("crowd_reports")
      .select("ghat_name, crowd_level, created_at")
      .order("created_at", { ascending: false });

    if (!data) return;
    const latest: Record<string, string> = {};
    data.forEach(r => {
      if (!latest[r.ghat_name]) latest[r.ghat_name] = r.crowd_level;
    });
    setCrowdData(latest);
  };

  const handleReport = async () => {
    setSubmitting(true);
    try {
      await supabase.from("crowd_reports").insert({
        user_id: user!.id,
        ghat_name: reportGhat,
        crowd_level: reportLevel,
      });
      toast({ title: t("crowd_reported") });
      fetchCrowdData();
    } catch (err: any) {
      toast({ title: t("error"), variant: "destructive" });
    }
    setSubmitting(false);
  };

  const getName = (ghat: any) => language === "te" ? ghat.name_te : language === "hi" ? ghat.name_hi : ghat.name_en;
  const getLevelInfo = (level: string) => LEVELS.find(l => l.value === level) || LEVELS[0];
  const getLevelLabel = (l: any) => language === "te" ? l.label_te : language === "hi" ? l.label_hi : l.label_en;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-card/95 px-4 py-3 shadow-sm backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-secondary">{t("crowd_detection")}</h1>
      </div>
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      <div className="container mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Report form */}
        <Card className="border-2 border-primary/30">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-display text-base font-bold">{t("report_crowd")}</h3>
            <Select value={reportGhat} onValueChange={setReportGhat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GHATS.map(g => <SelectItem key={g.id} value={g.id}>{getName(g)}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              {LEVELS.map(l => (
                <button
                  key={l.value}
                  onClick={() => setReportLevel(l.value)}
                  className={`flex-1 rounded-lg border-2 py-3 text-center font-body text-sm font-semibold transition-all ${
                    reportLevel === l.value ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <div className={`mx-auto mb-1 h-4 w-4 rounded-full ${l.color}`} />
                  {getLevelLabel(l)}
                </button>
              ))}
            </div>
            <Button onClick={handleReport} disabled={submitting} className="w-full">
              {t("submit")}
            </Button>
          </CardContent>
        </Card>

        {/* Crowd levels */}
        <h3 className="font-display text-base font-bold">{t("current_crowd")}</h3>
        <div className="space-y-2">
          {GHATS.map((ghat, i) => {
            const level = crowdData[ghat.id] || "low";
            const info = getLevelInfo(level);
            const Icon = info.icon;
            return (
              <motion.div key={ghat.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border-border">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${info.color}/20`}>
                      <Icon className={`h-5 w-5 ${level === "high" ? "text-red-500" : level === "medium" ? "text-yellow-500" : "text-green-500"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-sm font-bold">{getName(ghat)}</p>
                      <p className="font-body text-xs text-muted-foreground">{getLevelLabel(info)}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${info.color}`} />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CrowdDetectionPage;
