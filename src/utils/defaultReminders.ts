export type ReminderType =
  | "assessment"
  | "mood"
  | "journal"
  | "meditation"
  | "exam";

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  message: string;
  dueDate: string;
  read: boolean;
  path: string;
}

const STORAGE_PREFIX = "mindease-default-reminders";

const getStorageKey = (userId: string) =>
  `${STORAGE_PREFIX}-${userId}`;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date: Date) =>
  date.toISOString().split("T")[0];

/**
 * Creates the default reminders for every registered student.
 *
 * Default:
 * - Assessment: every 14 days
 * - Mood check: every 14 days
 * - Journal: daily
 * - Meditation: daily
 */
export const initializeDefaultReminders = (
  userId: string
): Reminder[] => {
  const key = getStorageKey(userId);

  const existing = localStorage.getItem(key);

  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      localStorage.removeItem(key);
    }
  }

  const today = new Date();

  const reminders: Reminder[] = [
    {
      id: `assessment-${formatDate(today)}`,
      type: "assessment",
      title: "Mental Health Assessment",
      message:
        "Your bi-weekly mental-health assessment is due. Take a few minutes to check in with yourself.",
      dueDate: formatDate(today),
      read: false,
      path: "/assessment",
    },
    {
      id: `mood-${formatDate(today)}`,
      type: "mood",
      title: "Mood Check",
      message:
        "How are you feeling today? Take a moment to record your current mood.",
      dueDate: formatDate(today),
      read: false,
      path: "/mood-tracker",
    },
    {
      id: `journal-${formatDate(today)}`,
      type: "journal",
      title: "Daily Journal",
      message:
        "How are you? How was your day? Take a moment to write in your journal.",
      dueDate: formatDate(today),
      read: false,
      path: "/journal",
    },
    {
      id: `meditation-${formatDate(today)}`,
      type: "meditation",
      title: "Meditation & Relaxation",
      message:
        "Take 15–30 minutes for yourself today. A short meditation or relaxation session can help you unwind.",
      dueDate: formatDate(today),
      read: false,
      path: "/stress-relief",
    },
  ];

  localStorage.setItem(key, JSON.stringify(reminders));

  return reminders;
};

export const getReminders = (userId: string): Reminder[] => {
  const key = getStorageKey(userId);
  const stored = localStorage.getItem(key);

  if (!stored) {
    return initializeDefaultReminders(userId);
  }

  try {
    return JSON.parse(stored);
  } catch {
    return initializeDefaultReminders(userId);
  }
};

export const saveReminders = (
  userId: string,
  reminders: Reminder[]
) => {
  localStorage.setItem(
    getStorageKey(userId),
    JSON.stringify(reminders)
  );
};

/**
 * Generates the next recurring reminder when the current
 * reminder becomes due.
 */
export const generateNextRecurringReminder = (
  userId: string,
  reminder: Reminder
) => {
  const reminders = getReminders(userId);

  const today = new Date();

  const nextDate =
    reminder.type === "journal" ||
    reminder.type === "meditation"
      ? addDays(today, 1)
      : addDays(today, 14);

  const nextReminder: Reminder = {
    ...reminder,
    id: `${reminder.type}-${formatDate(nextDate)}-${Date.now()}`,
    dueDate: formatDate(nextDate),
    read: false,
  };

  saveReminders(userId, [...reminders, nextReminder]);

  return nextReminder;
};

export const markReminderAsRead = (
  userId: string,
  reminderId: string
) => {
  const reminders = getReminders(userId);

  const updated = reminders.map((reminder) =>
    reminder.id === reminderId
      ? { ...reminder, read: true }
      : reminder
  );

  saveReminders(userId, updated);

  return updated;
};
