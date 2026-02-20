import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, Shield, Heart, Building2, Users, Siren } from "lucide-react";

const HELPLINE_SECTIONS = [
  {
    category_en: "Emergency", category_te: "అత్యవసరం", category_hi: "आपातकालीन",
    icon: Siren,
    critical: true,
    contacts: [
      { name_en: "Police Control Room", name_te: "పోలీస్ కంట్రోల్ రూమ్", name_hi: "पुलिस कंट्रोल रूम", number: "100" },
      { name_en: "Ambulance", name_te: "అంబులెన్స్", name_hi: "एम्बुलेंस", number: "108" },
      { name_en: "Fire Services", name_te: "అగ్నిమాపక సేవలు", name_hi: "अग्निशमन सेवा", number: "101" },
      { name_en: "Disaster Management", name_te: "విపత్తు నిర్వహణ", name_hi: "आपदा प्रबंधन", number: "1070" },
    ],
  },
  {
    category_en: "Hospitals", category_te: "ఆసుపత్రులు", category_hi: "अस्पताल",
    icon: Heart,
    contacts: [
      { name_en: "Government Hospital", name_te: "ప్రభుత్వ ఆసుపత్రి", name_hi: "सरकारी अस्पताल", number: "0884-2345678" },
      { name_en: "Pushkar Medical Camp", name_te: "పుష్కర వైద్య శిబిరం", name_hi: "पुष्कर चिकित्सा शिविर", number: "0884-2345679" },
    ],
  },
  {
    category_en: "Security", category_te: "భద్రత", category_hi: "सुरक्षा",
    icon: Shield,
    contacts: [
      { name_en: "Pushkar Security Cell", name_te: "పుష్కర భద్రతా విభాగం", name_hi: "पुष्कर सुरक्षा सेल", number: "0884-2345680" },
      { name_en: "Women Helpline", name_te: "మహిళా హెల్ప్‌లైన్", name_hi: "महिला हेल्पलाइन", number: "181" },
      { name_en: "Child Helpline", name_te: "బాల హెల్ప్‌లైన్", name_hi: "बाल हेल्पलाइन", number: "1098" },
    ],
  },
  {
    category_en: "Temple Authorities", category_te: "ఆలయ అధికారులు", category_hi: "मंदिर प्रशासन",
    icon: Building2,
    contacts: [
      { name_en: "Temple Administration", name_te: "ఆలయ పరిపాలన", name_hi: "मंदिर प्रशासन", number: "0884-2345681" },
      { name_en: "Endowments Dept.", name_te: "దేవాదాయ శాఖ", name_hi: "बंदोबस्ती विभाग", number: "0884-2345682" },
    ],
  },
  {
    category_en: "Event Organizers", category_te: "కార్యక్రమ నిర్వాహకులు", category_hi: "आयोजन समिति",
    icon: Users,
    contacts: [
      { name_en: "Pushkaralu Committee", name_te: "పుష్కరాల కమిటీ", name_hi: "पुष्करालु समिति", number: "0884-2345683" },
      { name_en: "Information Desk", name_te: "సమాచార విభాగం", name_hi: "सूचना कक्ष", number: "0884-2345684" },
    ],
  },
];

const HelplinePage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const getField = (item: any, field: string) => {
    if (language === "te") return item[`${field}_te`] || item[`${field}_en`];
    if (language === "hi") return item[`${field}_hi`] || item[`${field}_en`];
    return item[`${field}_en`];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-card/95 px-4 py-3 shadow-sm backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-secondary">{t("helpline")}</h1>
      </div>
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      <div className="container mx-auto max-w-lg px-4 py-4 space-y-4">
        {HELPLINE_SECTIONS.map((section, si) => {
          const Icon = section.icon;
          return (
            <motion.div key={si} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}>
              <Card className={`border-border ${section.critical ? "border-2 border-destructive/40" : ""}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      section.critical ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-base font-bold">{getField(section, "category")}</h3>
                    {section.critical && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-body text-xs font-semibold text-destructive">
                        {t("critical")}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {section.contacts.map((contact, ci) => (
                      <div key={ci} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                        <div>
                          <p className="font-body text-sm font-medium">{getField(contact, "name")}</p>
                          <p className="font-body text-xs text-muted-foreground">{contact.number}</p>
                        </div>
                        <a
                          href={`tel:${contact.number}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-110"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HelplinePage;
