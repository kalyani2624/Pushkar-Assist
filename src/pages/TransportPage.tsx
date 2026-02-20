import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bike, Car, Bus, ExternalLink } from "lucide-react";

const TRANSPORT_OPTIONS = [
  {
    id: "rapido",
    name: "Rapido",
    type_en: "Bike Taxi", type_te: "బైక్ ట్యాక్సీ", type_hi: "बाइक टैक्सी",
    desc_en: "Affordable bike rides for quick trips around the festival area.",
    desc_te: "ఉత్సవ ప్రాంతంలో త్వరిత ప్రయాణాలకు సరసమైన బైక్ రైడ్‌లు.",
    desc_hi: "उत्सव क्षेत्र में त्वरित यात्रा के लिए किफायती बाइक राइड।",
    icon: Bike,
    url: "https://www.rapido.bike/",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "ola",
    name: "Ola",
    type_en: "Cab / Auto", type_te: "క్యాబ్ / ఆటో", type_hi: "कैब / ऑटो",
    desc_en: "Book cabs and autos for comfortable travel with families.",
    desc_te: "కుటుంబాలతో సౌకర్యవంతమైన ప్రయాణం కోసం క్యాబ్‌లు మరియు ఆటోలను బుక్ చేయండి.",
    desc_hi: "परिवार के साथ आरामदायक यात्रा के लिए कैब और ऑटो बुक करें।",
    icon: Car,
    url: "https://www.olacabs.com/",
    color: "from-green-400 to-green-600",
  },
  {
    id: "uber",
    name: "Uber",
    type_en: "Cab Service", type_te: "క్యాబ్ సేవ", type_hi: "कैब सेवा",
    desc_en: "Premium cab service available for longer distance travel.",
    desc_te: "ఎక్కువ దూర ప్రయాణాలకు ప్రీమియం క్యాబ్ సేవ.",
    desc_hi: "लंबी दूरी की यात्रा के लिए प्रीमियम कैब सेवा।",
    icon: Car,
    url: "https://www.uber.com/",
    color: "from-gray-600 to-gray-800",
  },
  {
    id: "local",
    name_en: "Local Transport", name_te: "స్థానిక రవాణా", name_hi: "स्थानीय परिवहन",
    type_en: "Bus / Shuttle", type_te: "బస్ / షటిల్", type_hi: "बस / शटल",
    desc_en: "Government-run buses and shuttle services connecting major festival points.",
    desc_te: "ప్రధాన ఉత్సవ స్థలాలను కలుపుతూ ప్రభుత్వ బస్సులు మరియు షటిల్ సేవలు.",
    desc_hi: "प्रमुख उत्सव स्थलों को जोड़ने वाली सरकारी बसें और शटल सेवाएं।",
    icon: Bus,
    url: null,
    color: "from-blue-400 to-blue-600",
  },
];

const TransportPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const getField = (item: any, field: string) => {
    if (language === "te") return item[`${field}_te`] || item[`${field}_en`] || item[field];
    if (language === "hi") return item[`${field}_hi`] || item[`${field}_en`] || item[field];
    return item[`${field}_en`] || item[field];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-card/95 px-4 py-3 shadow-sm backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-secondary">{t("transport")}</h1>
      </div>
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      <div className="container mx-auto max-w-lg px-4 py-4 space-y-4">
        {TRANSPORT_OPTIONS.map((opt, i) => {
          const Icon = opt.icon;
          return (
            <motion.div key={opt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4 p-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${opt.color} text-white shadow-md`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-display text-lg font-bold text-secondary">{opt.name || getField(opt, "name")}</h3>
                      <p className="font-body text-xs font-semibold text-primary">{getField(opt, "type")}</p>
                      <p className="font-body text-sm text-foreground/80">{getField(opt, "desc")}</p>
                    </div>
                  </div>
                  {opt.url ? (
                    <div className="border-t border-border px-4 py-3">
                      <Button
                        className="w-full gap-2"
                        onClick={() => window.open(opt.url!, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t("book_now")}
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t border-border bg-muted/30 px-4 py-3">
                      <p className="text-center font-body text-xs text-muted-foreground">{t("local_transport_info")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TransportPage;
