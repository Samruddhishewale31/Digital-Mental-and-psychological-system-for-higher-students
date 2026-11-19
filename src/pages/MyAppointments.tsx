
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  ArrowLeft,
  Search,
  CalendarDays,
  Clock3,
  Monitor,
  Building2,
  CircleX,
  CalendarClock,
  FileText,
  Download,
  RefreshCcw,
} from "lucide-react";

import { authenticatedRequest } from "@/auth/authService";

interface Appointment {
  bookingId: string;
  counsellorId: number;
  counsellorName: string;
  counsellorImage: string;
  specialization: string;
  date: string;
  time: string;
  mode: string;
  reason: string;
  notes: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  bookedAt: string;
  anonymous: boolean;
}

interface DatabaseAppointment {
  id: number;
  booking_code: string;
  counsellor_id: number;
  counsellor_label: string;
  counsellor_image: string | null;
  specialization: string | null;
  appointment_at: string;
  appointment_mode: string;
  reason: string;
  notes: string | null;
  status: string;
  is_anonymous: boolean;
  created_at: string;
}

interface AppointmentsResponse {
  success: boolean;
  appointments: DatabaseAppointment[];
  message?: string;
}

function formatDateForInput(value: string) {
  const date = new Date(value);

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function formatTimeForDisplay(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatAppointmentDateTime(date: string, time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    throw new Error("Please select a valid appointment time.");
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const hourString = String(hours).padStart(2, "0");
  const minuteString = String(minutes).padStart(2, "0");

  return `${date}T${hourString}:${minuteString}:00+05:30`;
}

function mapAppointment(row: DatabaseAppointment): Appointment {
  const status = row.status.toLowerCase();

  let displayStatus: Appointment["status"] = "Pending";

  if (status === "confirmed") {
    displayStatus = "Confirmed";
  } else if (status === "cancelled") {
    displayStatus = "Cancelled";
  } else if (status === "completed") {
    displayStatus = "Completed";
  }

  return {
    bookingId: row.booking_code,
    counsellorId: row.counsellor_id,
    counsellorName: row.counsellor_label,
    counsellorImage: row.counsellor_image || "",
    specialization: row.specialization || "",
    date: formatDateForInput(row.appointment_at),
    time: formatTimeForDisplay(row.appointment_at),
    mode: row.appointment_mode,
    reason: row.reason,
    notes: row.notes || "",
    status: displayStatus,
    bookedAt: row.created_at,
    anonymous: row.is_anonymous,
  };
}

export default function MyAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");

  const [tab, setTab] = useState<"Upcoming" | "Cancelled">("Upcoming");

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [showReschedule, setShowReschedule] = useState(false);

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch appointments belonging to the logged-in user.
  useEffect(() => {
    let isMounted = true;

    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await authenticatedRequest<AppointmentsResponse>(
            "/api/appointments"
          );

        if (!response.success) {
          throw new Error(
            response.message || "Could not load appointments."
          );
        }

        const mappedAppointments = (response.appointments || []).map(
          mapAppointment
        );

        if (isMounted) {
          setAppointments(mappedAppointments);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load appointments. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchText = search.toLowerCase();

      const searchMatch =
        appointment.counsellorName.toLowerCase().includes(searchText) ||
        appointment.reason.toLowerCase().includes(searchText);

      const tabMatch =
        tab === "Upcoming"
          ? appointment.status !== "Cancelled"
          : appointment.status === "Cancelled";

      return searchMatch && tabMatch;
    });
  }, [appointments, search, tab]);

  // Cancel appointment in PostgreSQL.
  const cancelAppointment = async (bookingId: string) => {
    try {
      setSaving(true);
      setError("");

      const response = await authenticatedRequest<{
        success: boolean;
        message?: string;
      }>(
        `/api/appointments/${encodeURIComponent(bookingId)}/cancel`,
        {
          method: "PATCH",
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Could not cancel appointment.");
      }

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.bookingId === bookingId
            ? { ...appointment, status: "Cancelled" }
            : appointment
        )
      );

      if (selectedAppointment?.bookingId === bookingId) {
        setSelectedAppointment({
          ...selectedAppointment,
          status: "Cancelled",
        });
      }
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to cancel appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  const openReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setShowReschedule(true);
  };

  // Save the new appointment date and time in PostgreSQL.
  const saveReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) {
      alert("Please select both a date and a time.");
      return;
    }

    try {
      const appointmentAt = formatAppointmentDateTime(newDate, newTime);

      if (new Date(appointmentAt).getTime() <= Date.now()) {
        alert("Please select a future date and time.");
        return;
      }

      setSaving(true);
      setError("");

      const response = await authenticatedRequest<{
        success: boolean;
        message?: string;
      }>(
        `/api/appointments/${encodeURIComponent(
          selectedAppointment.bookingId
        )}/reschedule`,
        {
          method: "PATCH",
          body: JSON.stringify({ appointmentAt }),
        }
      );

      if (!response.success) {
        throw new Error(
          response.message || "Could not reschedule appointment."
        );
      }

      const updatedAppointment = {
        ...selectedAppointment,
        date: newDate,
        time: newTime,
      };

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.bookingId === selectedAppointment.bookingId
            ? updatedAppointment
            : appointment
        )
      );

      setSelectedAppointment(updatedAppointment);
      setShowReschedule(false);

      alert("Appointment rescheduled successfully.");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to reschedule appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  const downloadSlip = (appointment: Appointment) => {
    const text = `
Student Counselling Appointment

Appointment ID : ${appointment.bookingId}

Counsellor : ${appointment.counsellorName}

Date : ${appointment.date}

Time : ${appointment.time}

Mode : ${appointment.mode}

Reason : ${appointment.reason}

Status : ${appointment.status}

Notes : ${appointment.notes || "No notes"}
`;

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${appointment.bookingId}.txt`;

    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8F6FF] py-10">
      <div className="max-w-7xl mx-auto px-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex justify-between items-center mt-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold">My Appointments</h1>

            <p className="text-gray-500 mt-2">
              Manage all your counselling sessions.
            </p>
          </div>

          <Button onClick={() => navigate("/counselling")}>
            Book New Appointment
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-10">
          <Search
            className="absolute left-5 top-4 text-gray-400"
            size={20}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by counsellor or reason..."
            className="w-full rounded-2xl border bg-white pl-14 pr-5 py-4"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-8">
          <Button
            variant={tab === "Upcoming" ? "default" : "outline"}
            onClick={() => setTab("Upcoming")}
          >
            Upcoming
          </Button>

          <Button
            variant={tab === "Cancelled" ? "default" : "outline"}
            onClick={() => setTab("Cancelled")}
          >
            Cancelled
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-3xl border mt-10 p-12 text-center">
            <p className="text-gray-500">Loading your appointments...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl mt-10 p-6">
            <p className="font-semibold">Unable to load appointments</p>
            <p className="mt-2">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAppointments.length === 0 && (
          <div className="bg-white rounded-3xl border shadow-sm mt-10 p-12 text-center">
            <CalendarClock
              size={60}
              className="mx-auto text-purple-600"
            />

            <h2 className="text-2xl font-bold mt-6">
              No Appointments Found
            </h2>

            <p className="mt-3 text-gray-500">
              {tab === "Cancelled"
                ? "You don't have any cancelled appointments."
                : "Book your first counselling session."}
            </p>

            {tab === "Upcoming" && (
              <Button
                className="mt-8"
                onClick={() => navigate("/counselling")}
              >
                Book Appointment
              </Button>
            )}
          </div>
        )}

        {/* Appointment cards */}
        {!loading && !error && (
          <div className="space-y-8 mt-10">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.bookingId}
                className="bg-white rounded-3xl border shadow-sm p-8"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
                  {/* Counsellor */}
                  <div className="flex gap-6">
                    {appointment.counsellorImage ? (
                      <img
                        src={appointment.counsellorImage}
                        alt={appointment.counsellorName}
                        className="w-28 h-28 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-2xl">
                        {appointment.counsellorName.charAt(0)}
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl font-bold">
                        {appointment.counsellorName}
                      </h2>

                      <p className="text-purple-600 mt-2">
                        {appointment.specialization}
                      </p>

                      <div className="flex flex-wrap gap-5 mt-5">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={18} />
                          {appointment.date}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock3 size={18} />
                          {appointment.time}
                        </span>

                        <span className="flex items-center gap-2">
                          {appointment.mode === "Online" ? (
                            <Monitor size={18} />
                          ) : (
                            <Building2 size={18} />
                          )}
                          {appointment.mode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div
                      className={`rounded-full px-5 py-3 font-semibold ${statusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-8 mt-10">
                  <div>
                    <h3 className="font-semibold">
                      Student Information
                    </h3>

                    <div className="space-y-2 mt-4 text-gray-600">
                      <p>
                        <strong>Account :</strong> Signed-in MindEase
                        account
                      </p>

                      <p>
                        <strong>Anonymous display preference :</strong>{" "}
                        {appointment.anonymous ? "Requested" : "Not requested"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">Session Details</h3>

                    <div className="space-y-2 mt-4 text-gray-600">
                      <p>
                        <strong>Reason :</strong> {appointment.reason}
                      </p>

                      <p>
                        <strong>Notes :</strong>{" "}
                        {appointment.notes || "No notes"}
                      </p>

                      <p>
                        <strong>Booking ID :</strong>{" "}
                        {appointment.bookingId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 mt-10">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>

                  {appointment.status !== "Cancelled" &&
                    appointment.status !== "Completed" && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => openReschedule(appointment)}
                          disabled={saving}
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Reschedule
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" disabled={saving}>
                              <CircleX className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel Appointment?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                This appointment will be cancelled and
                                moved to your cancelled appointments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep Appointment
                              </AlertDialogCancel>

                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() =>
                                  cancelAppointment(appointment.bookingId)
                                }
                              >
                                Yes, Cancel Appointment
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                  <Button
                    variant="outline"
                    onClick={() => downloadSlip(appointment)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Slip
                  </Button>

                  <Button
                    onClick={() => {
                      const calendarUrl =
                        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
                        `&text=${encodeURIComponent("Counselling Session")}` +
                        `&dates=${encodeURIComponent(
                          appointment.date.replace(/-/g, "")+
                            "T" +
                            appointment.time
                              .replace(":", "")
                              .replace(" ", "") +
                            "00"
                        )}` +
                        `&details=${encodeURIComponent(
                          "Student Wellness Appointment"
                        )}`;

                      window.open(calendarUrl, "_blank");
                    }}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Google Calendar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appointment Details Dialog */}
        {selectedAppointment && !showReschedule && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center gap-4">
                <h2 className="text-3xl font-bold">
                  Appointment Details
                </h2>

                <Button
                  variant="outline"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="font-semibold text-lg">Counsellor</h3>

                  {selectedAppointment.counsellorImage ? (
                    <img
                      src={selectedAppointment.counsellorImage}
                      alt={selectedAppointment.counsellorName}
                      className="w-24 h-24 rounded-2xl object-cover mt-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-2xl mt-4">
                      {selectedAppointment.counsellorName.charAt(0)}
                    </div>
                  )}

                  <p className="mt-4 font-bold">
                    {selectedAppointment.counsellorName}
                  </p>

                  <p className="text-purple-600">
                    {selectedAppointment.specialization}
                  </p>
                </div>

                <div className="space-y-3">
                  <p>
                    <strong>Booking ID :</strong>{" "}
                    {selectedAppointment.bookingId}
                  </p>

                  <p>
                    <strong>Date :</strong> {selectedAppointment.date}
                  </p>

                  <p>
                    <strong>Time :</strong> {selectedAppointment.time}
                  </p>

                  <p>
                    <strong>Mode :</strong> {selectedAppointment.mode}
                  </p>

                  <p>
                    <strong>Status :</strong> {selectedAppointment.status}
                  </p>

                  <p>
                    <strong>Reason :</strong> {selectedAppointment.reason}
                  </p>

                  <p>
                    <strong>Notes :</strong>{" "}
                    {selectedAppointment.notes || "No Notes"}
                  </p>

                  <p>
                    <strong>Anonymous display preference :</strong>{" "}
                    {selectedAppointment.anonymous
                      ? "Requested"
                      : "Not requested"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Dialog */}
        {showReschedule && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold">
                Reschedule Appointment
              </h2>

              <p className="text-gray-500 mt-2">
                Select a new date and time.
              </p>

              <div className="mt-8">
                <label className="font-semibold">New Date</label>

                <input
                  type="date"
                  value={newDate}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border p-4 mt-3"
                />
              </div>

              <div className="mt-8">
                <label className="font-semibold">New Time</label>

                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-xl border p-4 mt-3"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setShowReschedule(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button onClick={saveReschedule} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
