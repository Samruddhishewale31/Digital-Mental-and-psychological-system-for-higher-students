import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JournalEntry {
  id: number;
  date: string;
  content: string;
  prompt: string;
}

const prompts = [
  "How are you feeling today?",
  "What stressed you today?",
  "What are you grateful for right now?",
  "What would make today better?",
];

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [isWriting, setIsWriting] = useState(false);

  const saveEntry = () => {
    if (!content.trim()) return;
    const entry: JournalEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      content,
      prompt: selectedPrompt,
    };
    setEntries([entry, ...entries]);
    setContent("");
    setIsWriting(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Journal</h1>
        <p className="text-muted-foreground">A quiet space for your thoughts. Start whenever you're ready.</p>
      </motion.div>

      {!isWriting ? (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsWriting(true)}
          className="w-full p-8 bg-card rounded-[24px] shadow-soft hover:shadow-float transition-all border border-transparent hover:border-primary/10 text-left mb-8 group"
        >
          <div className="flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New journal entry...</span>
          </div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-card rounded-[24px] shadow-float mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPrompt(p)}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  selectedPrompt === p ? "bg-primary/10 text-primary font-medium" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-lg font-medium mb-4 text-foreground">{selectedPrompt}</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-48 bg-transparent resize-none focus:outline-none text-foreground leading-relaxed placeholder:text-muted-foreground/50"
            autoFocus
          />
          <div className="flex justify-between items-center mt-4">
            <Button variant="ghost" onClick={() => { setIsWriting(false); setContent(""); }}>Cancel</Button>
            <Button onClick={saveEntry} disabled={!content.trim()}>Share with us</Button>
          </div>
        </motion.div>
      )}

      {/* Entries */}
      {entries.length === 0 && !isWriting && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">The journal is a quiet space for your thoughts.</p>
          <p className="text-sm mt-1">Start whenever you're ready.</p>
        </div>
      )}

      <AnimatePresence>
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-card rounded-[20px] shadow-soft mb-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="w-4 h-4" />
              {entry.date}
            </div>
            <p className="text-xs text-primary font-medium mb-2">{entry.prompt}</p>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{entry.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Journal;
