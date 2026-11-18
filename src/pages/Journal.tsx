
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

import {
  FaBookOpen,
  FaPlus,
  FaSearch,
  FaHeart,
  FaLeaf,
  FaPen,
  FaCalendarAlt,
  FaTrash,
  FaEdit,
  FaFilePdf,
  FaFire,
  FaChartLine,
  FaSmile,
  FaRegLightbulb,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";

interface JournalEntry {
  id: number;
  date: string;
  mood: string;
  thoughts: string;
  feelings: string;
  gratitude: string;
  reflection: string;
}

type JournalTab = "thoughts" | "feelings" | "gratitude" | "reflection";

const tabs: {
  id: JournalTab;
  name: string;
  icon: React.ComponentType;
}[] = [
  { id: "thoughts", name: "Thoughts", icon: FaPen },
  { id: "feelings", name: "Feelings", icon: FaHeart },
  { id: "gratitude", name: "Gratitude", icon: FaLeaf },
  { id: "reflection", name: "Reflection", icon: FaRegLightbulb },
];

const moods = [
  { name: "Happy", icon: FaSmile },
  { name: "Calm", icon: FaLeaf },
  { name: "Neutral", icon: FaSmile },
  { name: "Sad", icon: FaHeart },
  { name: "Stressed", icon: FaFire },
  { name: "Anxious", icon: FaChartLine },
  { name: "Hopeful", icon: FaRegLightbulb },
];

const prompts: Record<JournalTab, string[]> = {
  thoughts: [
    "What is on your mind today?",
    "Describe your day.",
  ],
  feelings: [
    "How are you feeling today?",
    "What emotion did you experience?",
  ],
  gratitude: [
    "What are you grateful for today?",
    "Who made your day better?",
  ],
  reflection: [
    "What did you learn today?",
    "What will you improve tomorrow?",
  ],
};

const STORAGE_KEY = "journal_entries";

const Journal = () => {
  const navigate = useNavigate();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<JournalTab>("thoughts");
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [selectedMood, setSelectedMood] = useState("Happy");

  const [thoughts, setThoughts] = useState("");
  const [feelings, setFeelings] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [reflection, setReflection] = useState("");

  // Load saved journal entries.
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);

      if (data) {
        const parsed = JSON.parse(data);

        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      }
    } catch (error) {
      console.error("Unable to load journal entries:", error);
    }
  }, []);

  // Save entries to localStorage.
  const updateStorage = (updatedEntries: JournalEntry[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedEntries)
      );

      setEntries(updatedEntries);
    } catch (error) {
      console.error("Unable to save journal entries:", error);
      alert("Unable to save your journal entry. Please try again.");
    }
  };

  // Clear the writing form.
  const clearForm = () => {
    setThoughts("");
    setFeelings("");
    setGratitude("");
    setReflection("");
    setSelectedMood("Happy");
    setEditingId(null);
    setIsWriting(false);
    setActiveTab("thoughts");
  };

  // Save a new entry or update an existing one.
  const saveEntry = () => {
    if (
      !thoughts.trim() &&
      !feelings.trim() &&
      !gratitude.trim() &&
      !reflection.trim()
    ) {
      alert("Please write something before saving your journal entry.");
      return;
    }

    let updatedEntries: JournalEntry[];

    if (editingId !== null) {
      updatedEntries = entries.map((entry) =>
        entry.id === editingId
          ? {
              ...entry,
              mood: selectedMood,
              thoughts,
              feelings,
              gratitude,
              reflection,
            }
          : entry
      );
    } else {
      const newEntry: JournalEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        mood: selectedMood,
        thoughts,
        feelings,
        gratitude,
        reflection,
      };

      updatedEntries = [newEntry, ...entries];
    }

    updateStorage(updatedEntries);
    clearForm();
  };

  // Load an entry into the editor.
  const editEntry = (entry: JournalEntry) => {
    setThoughts(entry.thoughts);
    setFeelings(entry.feelings);
    setGratitude(entry.gratitude);
    setReflection(entry.reflection);
    setSelectedMood(entry.mood);
    setEditingId(entry.id);
    setIsWriting(true);
    setActiveTab("thoughts");
  };

  // Delete an entry.
  const deleteEntry = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this journal entry?"
    );

    if (!confirmed) return;

    updateStorage(entries.filter((entry) => entry.id !== id));
  };

  // Update the text in the currently selected section.
  const updateCurrentText = (value: string) => {
    switch (activeTab) {
      case "thoughts":
        setThoughts(value);
        break;
      case "feelings":
        setFeelings(value);
        break;
      case "gratitude":
        setGratitude(value);
        break;
      case "reflection":
        setReflection(value);
        break;
    }
  };

  // Get text for the active section.
  const currentText = () => {
    switch (activeTab) {
      case "thoughts":
        return thoughts;
      case "feelings":
        return feelings;
      case "gratitude":
        return gratitude;
      case "reflection":
        return reflection;
    }
  };

  // Search journal entries.
  const filteredEntries = entries.filter((entry) =>
    JSON.stringify(entry).toLowerCase().includes(search.toLowerCase())
  );

  const totalEntries = entries.length;

  // Calculate the current consecutive-day writing streak.
  const calculateStreak = () => {
    if (entries.length === 0) return 0;

    const uniqueDates = [
      ...new Set(
        entries.map((entry) =>
          new Date(entry.date).toLocaleDateString("en-CA")
        )
      ),
    ].sort((a, b) => b.localeCompare(a));

    const today = new Date();
    const todayString = today.toLocaleDateString("en-CA");

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayString = yesterday.toLocaleDateString("en-CA");

    if (
      uniqueDates[0] !== todayString &&
      uniqueDates[0] !== yesterdayString
    ) {
      return 0;
    }

    let streak = 0;
    const checkDate = new Date(`${uniqueDates[0]}T12:00:00`);

    for (const date of uniqueDates) {
      const expectedDate = checkDate.toLocaleDateString("en-CA");

      if (date !== expectedDate) break;

      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  const streak = calculateStreak();

  // Count entries from the current month and year.
  const now = new Date();

  const monthEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);

    return (
      entryDate.getMonth() === now.getMonth() &&
      entryDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Display the most recently saved mood.
  const currentMood = entries.length > 0
    ? entries[0].mood
    : "Not set";

  const allText = thoughts + feelings + gratitude + reflection;

  const words = allText.trim()
    ? allText.trim().split(/\s+/).length
    : 0;

  const characters = allText.length;

  // Export all journal entries as a PDF.
  const exportPDF = () => {
    if (entries.length === 0) return;

    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const usableWidth = pdf.internal.pageSize.getWidth() - margin * 2;

    let y = 20;

    pdf.setFontSize(18);
    pdf.text("Digital Wellness Journal", margin, y);

    y += 12;

    pdf.setFontSize(10);
    pdf.text(
      `Exported on: ${new Date().toLocaleDateString()}`,
      margin,
      y
    );

    y += 12;

    entries.forEach((entry, index) => {
      const sections = [
        ["Thoughts", entry.thoughts],
        ["Feelings", entry.feelings],
        ["Gratitude", entry.gratitude],
        ["Reflection", entry.reflection],
      ].filter((section) => section[1].trim());

      const date = new Date(entry.date).toLocaleDateString();

      const addText = (text: string, fontSize: number, spacing = 5) => {
        pdf.setFontSize(fontSize);

        const lines = pdf.splitTextToSize(text, usableWidth);

        if (y + lines.length * spacing > pageHeight - margin) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(lines, margin, y);
        y += lines.length * spacing + 2;
      };

      if (y > pageHeight - 45) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Entry ${index + 1} - ${entry.mood}`, margin, y);

      y += 7;

      pdf.setFont("helvetica", "normal");
      addText(`Date: ${date}`, 10);

      sections.forEach(([heading, content]) => {
        addText(`${heading}:`, 11);
        addText(content, 10);
      });

      y += 7;
    });

    pdf.save("MindEase_Wellness_Journal.pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-12">

        {/* NAVIGATION */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() =>
              navigate("/assessment", {
                state: { fromAssessment: true },
              })
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>

          <Button onClick={() => navigate("/home")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="flex items-center gap-3 text-4xl font-bold">
            <FaBookOpen className="text-primary" />
            Digital Wellness Journal
          </h1>

          <p className="mt-3 text-muted-foreground">
            A safe space to express thoughts, feelings, gratitude and reflections.
          </p>
        </motion.div>

        {/* STATISTICS */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">

          <div className="rounded-2xl bg-card p-6 shadow">
            <FaBookOpen className="text-2xl text-primary" />
            <h2 className="mt-3 text-3xl font-bold">{totalEntries}</h2>
            <p className="text-muted-foreground">Total Entries</p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow">
            <FaFire className="text-2xl text-orange-500" />
            <h2 className="mt-3 text-3xl font-bold">{streak}</h2>
            <p className="text-muted-foreground">Writing Streak (Days)</p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow">
            <FaChartLine className="text-2xl text-green-500" />
            <h2 className="mt-3 text-3xl font-bold">{monthEntries}</h2>
            <p className="text-muted-foreground">Entries This Month</p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow">
            <FaSmile className="text-2xl text-yellow-500" />
            <h2 className="mt-3 text-xl font-bold">{currentMood}</h2>
            <p className="text-muted-foreground">Latest Saved Mood</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-4 text-muted-foreground" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search journal entries..."
            aria-label="Search journal entries"
            className="w-full rounded-xl border bg-card py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="mb-8 flex flex-wrap justify-between gap-4">
          <Button
            onClick={() => {
              clearForm();
              setIsWriting(true);
            }}
          >
            <FaPlus className="mr-2" />
            New Entry
          </Button>

          <Button
            variant="outline"
            disabled={entries.length === 0}
            onClick={exportPDF}
          >
            <FaFilePdf className="mr-2" />
            Export PDF
          </Button>
        </div>

        {/* JOURNAL EDITOR */}
        <AnimatePresence>
          {isWriting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-10 rounded-3xl bg-card p-6 shadow sm:p-8"
            >
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
                <FaPen className="text-primary" />
                {editingId !== null ? "Edit Journal Entry" : "Write Journal"}
              </h2>

              {/* WRITING TABS */}
              <div className="mb-8 flex flex-wrap gap-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      aria-pressed={activeTab === tab.id}
                      className={`flex items-center gap-2 rounded-xl px-5 py-3 transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/70"
                      }`}
                    >
                      <Icon />
                      {tab.name}
                    </button>
                  );
                })}
              </div>

              {/* PROMPTS */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium">Reflection Prompts</h3>

                <div className="flex flex-wrap gap-3">
                  {prompts[activeTab].map((prompt) => (
                    <button
                      type="button"
                      key={prompt}
                      onClick={() =>
                        updateCurrentText(
                          currentText()
                            ? currentText() + "\n" + prompt + " "
                            : prompt + " "
                        )
                      }
                      className="rounded-full bg-muted px-4 py-2 text-sm transition-colors hover:bg-muted/70"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* MOOD SELECTION */}
              <h3 className="mb-4 font-medium">
                How are you feeling?
              </h3>

              <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {moods.map((mood) => {
                  const Icon = mood.icon;

                  return (
                    <button
                      type="button"
                      key={mood.name}
                      onClick={() => setSelectedMood(mood.name)}
                      aria-pressed={selectedMood === mood.name}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all hover:shadow-sm ${
                        selectedMood === mood.name
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <Icon className="text-xl" />
                      <span>{mood.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* TEXT EDITOR */}
              <label className="mb-2 block font-medium" htmlFor="journal-text">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </label>

              <textarea
                id="journal-text"
                value={currentText()}
                onChange={(e) => updateCurrentText(e.target.value)}
                placeholder={`Write your ${activeTab} here...`}
                className="min-h-[250px] w-full resize-y rounded-2xl border bg-background p-5 outline-none focus:ring-2 focus:ring-primary"
              />

              {/* WORD AND CHARACTER COUNT */}
              <div className="mt-3 flex justify-end gap-5 text-sm text-muted-foreground">
                <span>Words: {words}</span>
                <span>Characters: {characters}</span>
              </div>

              {/* SAVE / CANCEL */}
              <div className="mt-8 flex flex-wrap justify-between gap-4">
                <Button variant="outline" onClick={clearForm}>
                  Cancel
                </Button>

                <Button onClick={saveEntry}>
                  {editingId !== null ? "Update Entry" : "Save Journal Entry"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* JOURNAL HISTORY */}
        <div className="mt-12">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <FaBookOpen className="text-primary" />
            Your Journal Entries
          </h2>

          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl bg-card py-16 text-center shadow">
              <FaBookOpen className="mx-auto mb-5 text-5xl text-muted-foreground" />

              <h3 className="text-xl font-semibold">
                {search ? "No matching entries found" : "No journal entries yet"}
              </h3>

              <p className="mt-2 text-muted-foreground">
                {search
                  ? "Try searching with a different word."
                  : "Start writing your thoughts, feelings and reflections."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-3xl bg-card p-6 shadow sm:p-7"
                  >
                    {/* ENTRY HEADER */}
                    <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <h3 className="text-xl font-semibold">
                          Journal Entry
                        </h3>

                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <FaCalendarAlt />
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-primary/10 px-4 py-2 text-primary">
                          {entry.mood}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editEntry(entry)}
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <FaTrash className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* ENTRY CONTENT */}
                    <div className="space-y-5">
                      {entry.thoughts && (
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold">
                            <FaPen />
                            Thoughts
                          </h4>
                          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                            {entry.thoughts}
                          </p>
                        </div>
                      )}

                      {entry.feelings && (
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold">
                            <FaHeart />
                            Feelings
                          </h4>
                          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                            {entry.feelings}
                          </p>
                        </div>
                      )}

                      {entry.gratitude && (
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold">
                            <FaLeaf />
                            Gratitude
                          </h4>
                          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                            {entry.gratitude}
                          </p>
                        </div>
                      )}

                      {entry.reflection && (
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold">
                            <FaRegLightbulb />
                            Reflection
                          </h4>
                          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                            {entry.reflection}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
