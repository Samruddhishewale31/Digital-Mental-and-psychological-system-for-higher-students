import { useMemo, useState } from "react";
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

// import { Button } from "@/components/ui/button";

import {
  getAppointments,
  updateAppointments,
} from "@/utils/appointmentStorage";

export default function MyAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState(getAppointments());

  const [search, setSearch] = useState("");

  const [tab, setTab] = useState<"Upcoming" | "Cancelled">(
    "Upcoming"
  );

  const [selectedAppointment, setSelectedAppointment] =
    useState<any>(null);

  const [showReschedule, setShowReschedule] =
    useState(false);

  const [newDate, setNewDate] = useState("");

  const [newTime, setNewTime] = useState("");

  const statusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment: any) => {
      const searchMatch =
        appointment.counsellorName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.reason
          .toLowerCase()
          .includes(search.toLowerCase());

      const tabMatch =
        tab === "Upcoming"
          ? appointment.status !== "Cancelled"
          : appointment.status === "Cancelled";

      return searchMatch && tabMatch;
    });
  }, [appointments, search, tab]);

 const cancelAppointment = (bookingId: string) => {

  const updated = appointments.map((appointment: any) =>
    appointment.bookingId === bookingId
      ? {
          ...appointment,
          status: "Cancelled",
        }
      : appointment
  );

  setAppointments(updated);

  updateAppointments(updated);

};

  const openReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setShowReschedule(true);
  };

  const saveReschedule = () => {
    const updated = appointments.map((appointment: any) =>
      appointment.bookingId ===
      selectedAppointment.bookingId
        ? {
            ...appointment,
            date: newDate,
            time: newTime,
          }
        : appointment
    );

    setAppointments(updated);
    updateAppointments(updated);

    setShowReschedule(false);
  };

  const downloadSlip = (appointment: any) => {
    const text = `
Student Counselling Appointment

Appointment ID : ${appointment.bookingId}

Counsellor : ${appointment.counsellorName}

Date : ${appointment.date}

Time : ${appointment.time}

Mode : ${appointment.mode}

Reason : ${appointment.reason}

Status : ${appointment.status}
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

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex justify-between items-center mt-8">
          <div>
            <h1 className="text-4xl font-bold">
              My Appointments
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all your counselling sessions.
            </p>
          </div>

          <Button
            onClick={() => navigate("/counselling")}
          >
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by counsellor or reason..."
            className="w-full rounded-2xl border bg-white pl-14 pr-5 py-4"
          />

        </div>

        {/* Tabs */}

        <div className="flex gap-4 mt-8">

          <Button
            variant={
              tab === "Upcoming"
                ? "default"
                : "outline"
            }
            onClick={() => setTab("Upcoming")}
          >
            Upcoming
          </Button>

          <Button
            variant={
              tab === "Cancelled"
                ? "default"
                : "outline"
            }
            onClick={() => setTab("Cancelled")}
          >
            Cancelled
          </Button>

        </div>

        {filteredAppointments.length === 0 && (

          <div className="bg-white rounded-3xl border shadow-sm mt-10 p-12 text-center">

            <CalendarClock
              size={60}
              className="mx-auto text-purple-600"
            />

            <h2 className="text-2xl font-bold mt-6">
              No Appointments Found
            </h2>

            <p className="mt-3 text-gray-500">
              Book your first counselling session.
            </p>

            <Button
              className="mt-8"
              onClick={() =>
                navigate("/counselling")
              }
            >
              Book Appointment
            </Button>

          </div>

        )}

        <div className="space-y-8 mt-10">   

                      {filteredAppointments.map((appointment: any) => (

            <div
              key={appointment.bookingId}
              className="bg-white rounded-3xl border shadow-sm p-8"
            >

              <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

                {/* Left */}

                <div className="flex gap-6">

                  <img
                    src={appointment.counsellorImage}
                    alt={appointment.counsellorName}
                    className="w-28 h-28 rounded-2xl object-cover"
                  />

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

                        {appointment.mode === "Online"
                          ? <Monitor size={18}/>
                          : <Building2 size={18}/>
                        }

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
                      <strong>Name :</strong>{" "}
                      {appointment.anonymous
                        ? "Anonymous Student"
                        : appointment.studentName}
                    </p>

                    <p>
                      <strong>Email :</strong>{" "}
                      {appointment.email}
                    </p>

                    <p>
                      <strong>Phone :</strong>{" "}
                      {appointment.phone}
                    </p>

                  </div>

                </div>

                <div>

                  <h3 className="font-semibold">
                    Session Details
                  </h3>

                  <div className="space-y-2 mt-4 text-gray-600">

                    <p>
                      <strong>Reason :</strong>{" "}
                      {appointment.reason}
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
                  onClick={() =>
                    setSelectedAppointment(appointment)
                  }
                >

                  <FileText className="mr-2 h-4 w-4"/>

                  View Details

                </Button>

                {

                  appointment.status !== "Cancelled" && (

                    <Button
                      variant="outline"
                      onClick={() =>
                        openReschedule(appointment)
                      }
                    >

                      <RefreshCcw className="mr-2 h-4 w-4"/>

                      Reschedule

                    </Button>

                  )

                }

                {

                  appointment.status !== "Cancelled" && (

                    <AlertDialog>

  <AlertDialogTrigger asChild>

    <Button variant="outline">

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

        This appointment will be cancelled and moved to your
        cancelled appointments.

      </AlertDialogDescription>

    </AlertDialogHeader>

    <AlertDialogFooter>

      <AlertDialogCancel>

        Keep Appointment

      </AlertDialogCancel>

      <AlertDialogAction
        className="bg-red-600 hover:bg-red-700"
        onClick={() =>
          cancelAppointment(
            appointment.bookingId
          )
        }
      >

        Yes, Cancel Appointment

      </AlertDialogAction>

    </AlertDialogFooter>

  </AlertDialogContent>

</AlertDialog>

                  )

                }

                <Button
                  variant="outline"
                  onClick={() =>
                    downloadSlip(appointment)
                  }
                >

                  <Download className="mr-2 h-4 w-4"/>

                  Download Slip

                </Button>

                <Button
                  onClick={() => {

                    const url =
                      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Counselling Session&details=Student Wellness Appointment`;

                    window.open(url, "_blank");

                  }}
                >

                  <CalendarDays className="mr-2 h-4 w-4"/>

                  Google Calendar

                </Button>

              </div>

            </div>

          ))}

        </div>

                {/* ===========================
            Appointment Details Dialog
        ============================ */}

        {selectedAppointment && !showReschedule && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl">

              <div className="flex justify-between items-center">

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

                  <h3 className="font-semibold text-lg">
                    Counsellor
                  </h3>

                  <img
                    src={selectedAppointment.counsellorImage}
                    alt={selectedAppointment.counsellorName}
                    className="w-24 h-24 rounded-2xl object-cover mt-4"
                  />

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
                    <strong>Date :</strong>{" "}
                    {selectedAppointment.date}
                  </p>

                  <p>
                    <strong>Time :</strong>{" "}
                    {selectedAppointment.time}
                  </p>

                  <p>
                    <strong>Mode :</strong>{" "}
                    {selectedAppointment.mode}
                  </p>

                  <p>
                    <strong>Status :</strong>{" "}
                    {selectedAppointment.status}
                  </p>

                  <p>
                    <strong>Reason :</strong>{" "}
                    {selectedAppointment.reason}
                  </p>

                  <p>
                    <strong>Notes :</strong>{" "}
                    {selectedAppointment.notes || "No Notes"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* ===========================
            Reschedule Dialog
        ============================ */}

        {showReschedule && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl">

              <h2 className="text-3xl font-bold">
                Reschedule Appointment
              </h2>

              <p className="text-gray-500 mt-2">
                Select a new date and time.
              </p>

              <div className="mt-8">

                <label className="font-semibold">
                  New Date
                </label>

                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border p-4 mt-3"
                />

              </div>

              <div className="mt-8">

                <label className="font-semibold">
                  New Time
                </label>

                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-xl border p-4 mt-3"
                >

                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>01:00 PM</option>
                  <option>02:30 PM</option>
                  <option>04:00 PM</option>

                </select>

              </div>

              <div className="flex justify-end gap-4 mt-10">

                <Button
                  variant="outline"
                  onClick={() => setShowReschedule(false)}
                >
                  Cancel
                </Button>

                <Button
                  onClick={saveReschedule}
                >
                  Save Changes
                </Button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}