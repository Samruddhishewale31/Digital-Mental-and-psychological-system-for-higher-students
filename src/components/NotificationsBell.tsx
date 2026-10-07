import { useEffect, useState } from "react";
import {
  Bell,
  Brain,
  BookOpen,
  HeartPulse,
  PenLine,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getReminders,
  initializeDefaultReminders,
  markReminderAsRead,
  type Reminder,
} from "@/utils/defaultReminders";

interface NotificationsBellProps {
  userId: string;
}

const NotificationsBell = ({
  userId,
}: NotificationsBellProps) => {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initializeDefaultReminders(userId);
    setReminders(getReminders(userId));
  }, [userId]);

  const unreadCount = reminders.filter(
    (reminder) => !reminder.read
  ).length;

  const getIcon = (type: Reminder["type"]) => {
    switch (type) {
      case "assessment":
        return <Brain className="h-5 w-5" />;

      case "mood":
        return <HeartPulse className="h-5 w-5" />;

      case "journal":
        return <PenLine className="h-5 w-5" />;

      case "meditation":
        return <BookOpen className="h-5 w-5" />;

      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const handleReminderClick = (reminder: Reminder) => {
    const updated = markReminderAsRead(
      userId,
      reminder.id
    );

    setReminders(updated);
    setOpen(false);
    navigate(reminder.path);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-md p-2 hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-semibold">
                  Notifications
                </h3>
                <p className="text-xs text-muted-foreground">
                  Your default MindEase reminders
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {reminders.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No reminders available.
                </div>
              ) : (
                reminders
                  .filter((reminder) => {
                    const today = new Date()
                      .toISOString()
                      .split("T")[0];

                    return reminder.dueDate <= today;
                  })
                  .slice(-10)
                  .reverse()
                  .map((reminder) => (
                    <button
                      key={reminder.id}
                      onClick={() =>
                        handleReminderClick(reminder)
                      }
                      className={`flex w-full gap-3 border-b p-4 text-left hover:bg-muted ${
                        !reminder.read
                          ? "bg-muted/30"
                          : ""
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {getIcon(reminder.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">
                            {reminder.title}
                          </p>

                          {!reminder.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {reminder.message}
                        </p>
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsBell;
