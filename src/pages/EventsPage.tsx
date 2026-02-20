import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

const EVENTS_DATA = [
  { day: 1, events: [
    { name_en: "Grand Opening Ceremony", name_te: "గ్రాండ్ ప్రారంభోత్సవం", name_hi: "भव्य उद्घाटन समारोह", time: "6:00 AM", venue: "Saraswati Ghat", venue_te: "సరస్వతి ఘాట్", venue_hi: "सरस्वती घाट", desc_en: "Sacred water rituals and lamp lighting", desc_te: "పవిత్ర జల పూజలు మరియు దీప ప్రజ్వలన", desc_hi: "पवित्र जल अनुष्ठान और दीप प्रज्वलन" },
    { name_en: "Devotional Music Concert", name_te: "భక్తి సంగీత కచేరీ", name_hi: "भक्ति संगीत कार्यक्रम", time: "7:00 PM", venue: "Main Stage", venue_te: "ప్రధాన వేదిక", venue_hi: "मुख्य मंच", desc_en: "Classical music and bhajans by renowned artists", desc_te: "ప్రసిద్ధ కళాకారులచే శాస్త్రీయ సంగీతం", desc_hi: "प्रसिद्ध कलाकारों द्वारा शास्त्रीय संगीत" },
  ]},
  { day: 2, events: [
    { name_en: "Mass Prayer at Sunrise", name_te: "సూర్యోదయ సామూహిక ప్రార్థన", name_hi: "सूर्योदय सामूहिक प्रार्थना", time: "5:30 AM", venue: "Pushkara Ghat", venue_te: "పుష్కర ఘాట్", venue_hi: "पुष्कर घाट", desc_en: "Community prayer with holy water immersion", desc_te: "పవిత్ర జలంలో సామూహిక ప్రార్థన", desc_hi: "पवित्र जल में सामूहिक प्रार्थना" },
    { name_en: "Cultural Dance Program", name_te: "సాంస్కృతిక నృత్య కార్యక్రమం", name_hi: "सांस्कृतिक नृत्य कार्यक्रम", time: "6:00 PM", venue: "Cultural Hall", venue_te: "సాంస్కృతిక హాల్", venue_hi: "सांस्कृतिक हॉल", desc_en: "Traditional Kuchipudi and folk dances", desc_te: "సంప్రదాయ కూచిపూడి మరియు జానపద నృత్యాలు", desc_hi: "पारंपरिक कूचिपूड़ी और लोक नृत्य" },
  ]},
  { day: 3, events: [
    { name_en: "Special Pooja & Havan", name_te: "ప్రత్యేక పూజ & హవన్", name_hi: "विशेष पूजा एवं हवन", time: "7:00 AM", venue: "Padmavati Ghat", venue_te: "పద్మావతి ఘాట్", venue_hi: "पद्मावती घाट", desc_en: "Special fire rituals and prayers", desc_te: "ప్రత్యేక అగ్ని పూజలు", desc_hi: "विशेष अग्नि अनुष्ठान" },
  ]},
  { day: 4, events: [
    { name_en: "VIP Ministerial Visit", name_te: "VIP మంత్రి సందర్శన", name_hi: "VIP मंत्री दौरा", time: "10:00 AM", venue: "Main Stage", venue_te: "ప్రధాన వేదిక", venue_hi: "मुख्य मंच", desc_en: "Address by state dignitaries", desc_te: "రాష్ట్ర ప్రముఖుల ప్రసంగం", desc_hi: "राज्य गणमान्यों का संबोधन" },
    { name_en: "Annadanam (Free Meals)", name_te: "అన్నదానం", name_hi: "अन्नदानम (मुफ्त भोजन)", time: "12:00 PM", venue: "Community Kitchen", venue_te: "సామాజిక వంటశాల", venue_hi: "सामुदायिक रसोई", desc_en: "Free meals for all devotees", desc_te: "భక్తులందరికీ ఉచిత భోజనం", desc_hi: "सभी भक्तों के लिए मुफ्त भोजन" },
  ]},
  { day: 5, events: [{ name_en: "Spiritual Discourse", name_te: "ఆధ్యాత్మిక ప్రవచనం", name_hi: "आध्यात्मिक प्रवचन", time: "4:00 PM", venue: "Dhobi Ghat", venue_te: "ధోబీ ఘాట్", venue_hi: "धोबी घाट", desc_en: "Talks by spiritual leaders", desc_te: "ఆధ్యాత్మిక నాయకుల ప్రసంగాలు", desc_hi: "आध्यात्मिक नेताओं द्वारा वार्ता" }]},
  { day: 6, events: [{ name_en: "Boat Procession", name_te: "పడవ ఊరేగింపు", name_hi: "नौका जुलूस", time: "5:00 PM", venue: "Godavari River", venue_te: "గోదావరి నది", venue_hi: "गोदावरी नदी", desc_en: "Decorated boat parade on the river", desc_te: "నదిపై అలంకరించిన పడవల ఊరేగింపు", desc_hi: "नदी पर सजी नावों की परेड" }]},
  { day: 7, events: [{ name_en: "Youth Cultural Fest", name_te: "యువజన సాంస్కృతిక ఉత్సవం", name_hi: "युवा सांस्कृतिक उत्सव", time: "3:00 PM", venue: "Main Stage", venue_te: "ప్రధాన వేదిక", venue_hi: "मुख्य मंच", desc_en: "Young performers showcase talent", desc_te: "యువ కళాకారుల ప్రదర్శన", desc_hi: "युवा कलाकारों की प्रतिभा प्रदर्शनी" }]},
  { day: 8, events: [{ name_en: "Laksha Deepotsavam", name_te: "లక్ష దీపోత్సవం", name_hi: "लक्ष दीपोत्सवम", time: "6:30 PM", venue: "All Ghats", venue_te: "అన్ని ఘాట్లు", venue_hi: "सभी घाट", desc_en: "One lakh lamps lit along the river", desc_te: "నది వెంట లక్ష దీపాలు", desc_hi: "नदी के किनारे एक लाख दीपक" }]},
  { day: 9, events: [{ name_en: "Bhagavata Saptaham", name_te: "భాగవత సప్తాహం", name_hi: "भागवत सप्ताह", time: "9:00 AM", venue: "Temple Hall", venue_te: "ఆలయ హాల్", venue_hi: "मंदिर हॉल", desc_en: "Recitation of sacred texts", desc_te: "పవిత్ర గ్రంథాల పఠనం", desc_hi: "पवित्र ग्रंथों का पाठ" }]},
  { day: 10, events: [{ name_en: "Grand Procession", name_te: "గ్రాండ్ ఊరేగింపు", name_hi: "भव्य जुलूस", time: "4:00 PM", venue: "City Streets", venue_te: "నగర వీధులు", venue_hi: "शहर की सड़कें", desc_en: "Decorated chariots and cultural performances", desc_te: "అలంకరించిన రథాలు మరియు సాంస్కృతిక ప్రదర్శనలు", desc_hi: "सजे रथ और सांस्कृतिक कार्यक्रम" }]},
  { day: 11, events: [{ name_en: "Valedictory Function", name_te: "వీడ్కోలు కార్యక్రమం", name_hi: "समापन समारोह", time: "10:00 AM", venue: "Main Stage", venue_te: "ప్రధాన వేదిక", venue_hi: "मुख्य मंच", desc_en: "Closing ceremonies and awards", desc_te: "ముగింపు వేడుకలు మరియు అవార్డులు", desc_hi: "समापन समारोह और पुरस्कार" }]},
  { day: 12, events: [{ name_en: "Final Holy Dip & Farewell", name_te: "చివరి పవిత్ర స్నానం & వీడ్కోలు", name_hi: "अंतिम पवित्र स्नान और विदाई", time: "5:00 AM", venue: "Saraswati Ghat", venue_te: "సరస్వతి ఘాట్", venue_hi: "सरस्वती घाट", desc_en: "Final sacred dip and closing prayers", desc_te: "చివరి పవిత్ర స్నానం మరియు ముగింపు ప్రార్థనలు", desc_hi: "अंतिम पवित्र स्नान और समापन प्रार्थना" }]},
];

const EventsPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(1);

  const getField = (event: any, field: string) => {
    if (language === "te") return event[`${field}_te`] || event[`${field}_en`];
    if (language === "hi") return event[`${field}_hi`] || event[`${field}_en`];
    return event[`${field}_en`];
  };

  const dayData = EVENTS_DATA.find(d => d.day === selectedDay);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-card/95 px-4 py-3 shadow-sm backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-secondary">{t("events")}</h1>
      </div>
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      <div className="container mx-auto max-w-lg px-4 py-4">
        {/* Day selector */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 rounded-full px-4 py-2 font-body text-sm font-semibold transition-all ${
                selectedDay === day
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t("day")} {day}
            </button>
          ))}
        </div>

        {/* Events */}
        <div className="space-y-3">
          {dayData?.events.map((event, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-l-4 border-l-primary border-border">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-display text-lg font-bold text-secondary">{getField(event, "name")}</h3>
                  <div className="flex flex-wrap gap-3 font-body text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" />{event.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" />{getField(event, "venue")}</span>
                  </div>
                  <p className="font-body text-sm text-foreground/80">{getField(event, "desc")}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
