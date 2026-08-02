import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Calendar,
  Trash2,
  Pencil,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

interface JournalEntry {
  id: number;
  date: string;
  content: string;
  prompt: string;
  mood: string;
}

const prompts = [
  "How are you feeling today?",
  "What stressed you today?",
  "What are you grateful for right now?",
  "What would make today better?",
];

const moods = [
  "😊 Happy",
  "🙂 Calm",
  "😐 Neutral",
  "😞 Sad",
  "😣 Stressed",
];

const Journal = () => {
  const navigate = useNavigate();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  const characterCount = content.length;
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const deleteEntry = (id: number) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
  };

  const editEntry = (entry: JournalEntry) => {
    setContent(entry.content);
    setSelectedPrompt(entry.prompt);
    setSelectedMood(entry.mood);
    setEditingId(entry.id);
    setIsWriting(true);
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("My Journal Entries", 10, 20);

    let yPosition = 35;

    entries.forEach((entry, index) => {
      doc.setFontSize(12);

      doc.text(`Entry ${index + 1}`, 10, yPosition);
      yPosition += 8;

      doc.text(`Date: ${entry.date}`, 10, yPosition);
      yPosition += 8;

      doc.text(`Mood: ${entry.mood}`, 10, yPosition);
      yPosition += 8;

      doc.text(`Prompt: ${entry.prompt}`, 10, yPosition);
      yPosition += 8;

      const contentLines = doc.splitTextToSize(
        `Thoughts: ${entry.content}`,
        180
      );

      doc.text(contentLines, 10, yPosition);

      yPosition += contentLines.length * 7 + 10;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("My_Journal.pdf");
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.mood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const saveEntry = () => {
    if (!content.trim()) return;

    if (editingId !== null) {
      const updatedEntries = entries.map((entry) =>
        entry.id === editingId
          ? {
              ...entry,
              content,
              prompt: selectedPrompt,
              mood: selectedMood,
            }
          : entry
      );

      setEntries(updatedEntries);
      setEditingId(null);
    } else {
      const entry: JournalEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        content,
        prompt: selectedPrompt,
        mood: selectedMood,
      };

      setEntries([entry, ...entries]);
    }

    setContent("");
    setIsWriting(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">

      {/* Back Button */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessment
        </Button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Your Journal
        </h1>

        <p className="text-muted-foreground">
          A quiet space for your thoughts. Start whenever you're ready.
        </p>

        <Button
          className="mt-4"
          onClick={exportPDF}
          disabled={entries.length === 0}
        >
          Export Journal as PDF
        </Button>

        <input
          type="text"
          placeholder="Search journal entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mt-6 p-3 rounded-xl bg-card border focus:outline-none"
        />
      </motion.div>
      {/* Journal Entries */}
      <AnimatePresence>
        {filteredEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-card rounded-[20px] shadow-soft mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {entry.date}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editEntry(entry)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteEntry(entry.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <p className="text-xs text-primary font-medium mb-2">
              {entry.prompt}
            </p>

            <p className="text-sm font-medium mb-2">
              Mood: {entry.mood}
            </p>

            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="flex justify-center gap-4 mt-10">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessment
        </Button>

        <Button
          onClick={() => navigate("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          Back Home
        </Button>
      </div>
    </div>
  );
};

export default Journal;