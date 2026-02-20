import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";

const PLACES = [
  { name_en: "Saraswati Ghat", name_te: "సరస్వతి ఘాట్", name_hi: "सरस्वती घाट", desc_en: "The main bathing ghat dedicated to Goddess Saraswati. Most sacred spot for holy dip.", desc_te: "సరస్వతి దేవికి అంకితమైన ప్రధాన స్నాన ఘాట్.", desc_hi: "देवी सरस्वती को समर्पित प्रमुख स्नान घाट।", lat: 16.9426, lng: 81.7787 },
  { name_en: "Pushkara Ghat", name_te: "పుష్కర ఘాట్", name_hi: "पुष्कर घाट", desc_en: "Historic ghat with ancient stone steps leading to the Godavari river.", desc_te: "గోదావరి నదికి దారితీసే పురాతన రాతి మెట్లతో చారిత్రక ఘాట్.", desc_hi: "गोदावरी नदी तक प्राचीन पत्थर की सीढ़ियों वाला ऐतिहासिक घाट।", lat: 16.9430, lng: 81.7790 },
  { name_en: "Padmavati Ghat", name_te: "పద్మావతి ఘాట్", name_hi: "पद्मावती घाट", desc_en: "Beautiful ghat named after Goddess Padmavati with serene surroundings.", desc_te: "ప్రశాంత పరిసరాలతో పద్మావతి దేవి పేరిట అందమైన ఘాట్.", desc_hi: "शांत परिवेश के साथ देवी पद्मावती के नाम का सुंदर घाट।", lat: 16.9435, lng: 81.7795 },
  { name_en: "Dhobi Ghat", name_te: "ధోబీ ఘాట్", name_hi: "धोबी घाट", desc_en: "A lively ghat area popular among locals and visitors for evening gatherings.", desc_te: "సాయంత్రం సమావేశాలకు స్థానికులు మరియు సందర్శకులలో ప్రసిద్ధమైన ఘాట్.", desc_hi: "शाम की सभाओं के लिए स्थानीय लोगों और पर्यटकों में लोकप्रिय घाट।", lat: 16.9440, lng: 81.7800 },
  { name_en: "Sri Lakshmi Narasimha Temple", name_te: "శ్రీ లక్ష్మీ నరసింహ ఆలయం", name_hi: "श्री लक्ष्मी नरसिम्हा मंदिर", desc_en: "Ancient temple dedicated to Lord Narasimha with exquisite carvings.", desc_te: "అద్భుతమైన చెక్కడాలతో నరసింహ స్వామికి అంకితమైన పురాతన ఆలయం.", desc_hi: "भगवान नरसिम्हा को समर्पित प्राचीन मंदिर।", lat: 16.9420, lng: 81.7780 },
  { name_en: "Godavari Boat Ride Point", name_te: "గోదావరి బోట్ రైడ్ పాయింట్", name_hi: "गोदावरी नौका विहार स्थल", desc_en: "Enjoy scenic boat rides along the Godavari river during Pushkaralu.", desc_te: "పుష్కరాల సమయంలో గోదావరి నదిలో బోట్ రైడ్ ఆనందించండి.", desc_hi: "पुष्करालु के दौरान गोदावरी नदी पर सुंदर नाव सवारी।", lat: 16.9445, lng: 81.7805 },
];

const VisitPlacesPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const getField = (place: any, field: string) => {
    if (language === "te") return place[`${field}_te`] || place[`${field}_en`];
    if (language === "hi") return place[`${field}_hi`] || place[`${field}_en`];
    return place[`${field}_en`];
  };

  const openMaps = (place: any) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, "_blank");
  };

  const getDirections = (place: any) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-card/95 px-4 py-3 shadow-sm backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-secondary">{t("visit_places")}</h1>
      </div>
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      <div className="container mx-auto max-w-lg px-4 py-4 space-y-4">
        {PLACES.map((place, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="border-border overflow-hidden">
              {/* Map embed */}
              <div className="h-40 w-full">
                <iframe
                  title={getField(place, "name")}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${place.lat},${place.lng}&zoom=16`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-display text-lg font-bold text-secondary">{getField(place, "name")}</h3>
                <p className="font-body text-sm text-foreground/80">{getField(place, "desc")}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => openMaps(place)}>
                    <MapPin className="h-4 w-4" /> {t("open_maps")}
                  </Button>
                  <Button size="sm" className="gap-1 flex-1" onClick={() => getDirections(place)}>
                    <Navigation className="h-4 w-4" /> {t("get_directions")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VisitPlacesPage;
