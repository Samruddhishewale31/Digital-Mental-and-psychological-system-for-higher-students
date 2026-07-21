import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const counsellors = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "Academic Stress & Anxiety" },
  { id: 2, name: "Dr. James Miller", specialty: "Depression & Mood Disorders" },
  { id: 3, name: "Dr. Priya Sharma", specialty: "Burnout & Work-Life Balance" },
];

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const timeSlots = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

const CounsellingBooking = () => {
  const [selectedCounsellor, setSelectedCounsellor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const dates = generateDates();

  if (confirmed) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full p-12 bg-card rounded-[32px] shadow-float text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">Appointment Confirmed</h2>
          <p className="text-muted-foreground mb-6">Logged. You're doing great today.</p>
          <div className="bg-muted/50 rounded-2xl p-6 text-left space-y-2 text-sm">
            <p><span className="text-muted-foreground">Counsellor:</span> <span className="font-medium">{counsellors.find(c => c.id === selectedCounsellor)?.name}</span></p>
            <p><span className="text-muted-foreground">Date:</span> <span className="font-medium">{selectedDate}</span></p>
            <p><span className="text-muted-foreground">Time:</span> <span className="font-medium">{selectedTime}</span></p>
            {anonymous && <p className="text-primary text-xs font-medium">🔒 Anonymous booking</p>}
          </div>
          <Button className="mt-8 w-full" onClick={() => { setConfirmed(false); setSelectedCounsellor(null); setSelectedDate(null); setSelectedTime(null); }}>
            Book Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Counselling</h1>
        <p className="text-muted-foreground">Confidential, supportive sessions with campus counsellors.</p>
      </motion.div>

      {/* Counsellor Selection */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Select a Counsellor</h2>
        <div className="space-y-3">
          {counsellors.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCounsellor(c.id)}
              className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all ${
                selectedCounsellor === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}
            >
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.specialty}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2"><CalendarCheck className="w-4 h-4" /> Select a Date</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((d) => {
            const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 text-center transition-all min-w-[90px] ${
                  selectedDate === dateStr ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <p className="text-xs text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
                <p className="font-semibold text-lg">{d.getDate()}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Select a Time</h2>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`px-5 py-3 rounded-2xl border-2 font-medium text-sm transition-all ${
                selectedTime === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Anonymous */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="w-5 h-5 rounded accent-primary" />
          <span className="text-sm">Book anonymously</span>
        </label>
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!selectedCounsellor || !selectedDate || !selectedTime}
        onClick={() => setConfirmed(true)}
      >
        Confirm Appointment
      </Button>
    </div>
  );
};

export default CounsellingBooking;
