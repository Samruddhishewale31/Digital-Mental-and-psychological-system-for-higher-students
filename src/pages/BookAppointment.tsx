import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Calendar,
  Clock3,
  Monitor,
  Building2,
  FileText,
  NotebookPen,
  ShieldCheck,
  User,
  Mail,
  Phone,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { counsellors } from "@/data/counsellors";

import {
  saveAppointment,
} from "@/utils/appointmentStorage";

export default function BookAppointment() {

  const navigate = useNavigate();

  const { id } = useParams();

  const counsellor = useMemo(
    () =>
      counsellors.find(
        (c) => c.id === Number(id)
      ),
    [id]
  );

  const [studentName, setStudentName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [anonymous, setAnonymous] =
    useState(false);

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [mode, setMode] =
    useState("Online");

  const [reason, setReason] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [consent, setConsent] =
    useState(false);

  if (!counsellor) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Counsellor not found.

      </div>

    );

  }

  const reasons = [

    "Academic Stress",

    "Exam Anxiety",

    "Anxiety",

    "Depression",

    "Career Guidance",

    "Relationship Concerns",

    "Low Motivation",

    "Sleep Issues",

    "Burnout",

    "Self Confidence",

    "Other",

  ];

  const slots = [

    "09:00 AM",

    "10:00 AM",

    "11:00 AM",

    "01:00 PM",

    "02:30 PM",

    "04:00 PM",

  ];

  const handleBooking = () => {

    if (
      !studentName ||
      !email ||
      !phone ||
      !date ||
      !time ||
      !reason
    ) {

      alert(
        "Please complete all required fields."
      );

      return;

    }

    if (!consent) {

      alert(
        "Please accept the privacy policy."
      );

      return;

    }

    const bookingId =
      "MH-" +
      Math.floor(
        100000 + Math.random() * 900000
      );

    saveAppointment({

      bookingId,

      counsellorId: counsellor.id,

      counsellorName: counsellor.name,

      counsellorImage: counsellor.image,

      specialization:
        counsellor.specialization,

      date,

      time,

      mode,

      reason,

      notes,

      bookedAt:
        new Date().toLocaleString(),

      status: "Confirmed",

      studentName,

      email,

      phone,

      anonymous,

    });

    navigate("/my-appointments");

  };

  return (

    <div className="min-h-screen bg-[#F8F6FF] py-10">

      <div className="max-w-5xl mx-auto px-6">

        <Button

          variant="outline"

          onClick={() => navigate(-1)}

        >

          <ArrowLeft className="mr-2 h-4 w-4" />

          Back

        </Button>

        {/* Header */}

        <div className="bg-white rounded-3xl border shadow-sm mt-8 p-8">

          <h1 className="text-4xl font-bold">

            Book Student Counselling Session

          </h1>

          <p className="mt-3 text-gray-600 leading-7">

            Schedule a confidential counselling
            session with the Student Wellness
            Centre. Your information will remain
            private and will only be shared with
            your selected counsellor.

          </p>

        </div>

        {/* Counsellor */}

        <div className="bg-white rounded-3xl border shadow-sm mt-8 p-8">

          <div className="flex items-center gap-6">

            <img

              src={counsellor.image}

              alt={counsellor.name}

              className="w-28 h-28 rounded-2xl object-cover"

            />

            <div>

              <h2 className="text-3xl font-bold">

                {counsellor.name}

              </h2>

              <p className="text-purple-600 mt-2">

                {counsellor.designation}

              </p>

              <p className="mt-1">

                {counsellor.specialization}

              </p>

              <div className="flex items-center gap-2 mt-3 text-green-700">

                <BadgeCheck size={18} />

                Student Wellness Centre

              </div>

              <p className="text-sm text-gray-500 mt-2">

                Session Duration :
                {" "}
                {counsellor.sessionDuration}

              </p>

            </div>

          </div>

        </div>

        {/* Appointment Form */}

        <div className="bg-white rounded-3xl border shadow-sm mt-8 p-8">

          <h2 className="text-2xl font-bold">

            Student Details

          </h2> 
                    {/* Student Name */}

          <div className="mt-8">

            <label className="font-semibold flex items-center gap-2">

              <User size={18} />

              Student Name

            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) =>
                setStudentName(e.target.value)
              }
              className="mt-3 w-full rounded-xl border p-4"
            />

          </div>

          {/* College Email */}

          <div className="mt-8">

            <label className="font-semibold flex items-center gap-2">

              <Mail size={18} />

              College Email

            </label>

            <input
              type="email"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="mt-3 w-full rounded-xl border p-4"
            />

          </div>

          {/* Phone */}

          <div className="mt-8">

            <label className="font-semibold flex items-center gap-2">

              <Phone size={18} />

              Phone Number

            </label>

            <input
              type="tel"
              placeholder="Enter your mobile number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="mt-3 w-full rounded-xl border p-4"
            />

          </div>

          {/* Anonymous Booking */}

          <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-200 p-6">

            <label className="flex gap-4">

              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) =>
                  setAnonymous(e.target.checked)
                }
              />

              <div>

                <h3 className="font-semibold">

                  Anonymous Booking

                </h3>

                <p className="text-gray-600 mt-2 leading-7">

                  If selected, your identity will remain hidden
                  until the counselling session begins. This
                  option helps students who wish to seek support
                  privately.

                </p>

              </div>

            </label>

          </div>

          {/* Appointment Date */}

          <div className="mt-8">

            <label className="font-semibold flex items-center gap-2">

              <Calendar size={18} />

              Appointment Date

            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="mt-3 w-full rounded-xl border p-4"
            />

          </div>

          {/* Time */}

          <div className="mt-8">

            <label className="font-semibold flex items-center gap-2">

              <Clock3 size={18} />

              Preferred Time

            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">

              {slots.map((slot) => (

                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`rounded-xl border p-4 transition-all

                  ${
                    time === slot
                      ? "bg-purple-600 text-white border-purple-600"
                      : "hover:border-purple-600"
                  }`}
                >

                  {slot}

                </button>

              ))}

            </div>

          </div>

          {/* Session Mode */}

          <div className="mt-8">

            <label className="font-semibold">

              Session Mode

            </label>

            <div className="flex gap-4 mt-4">

              {counsellor.mode.includes("Online") && (

                <button
                  onClick={() => setMode("Online")}
                  className={`flex items-center gap-2 rounded-xl border px-6 py-4

                  ${
                    mode === "Online"
                      ? "bg-purple-600 text-white"
                      : ""
                  }`}
                >

                  <Monitor size={18} />

                  Online

                </button>

              )}

              {counsellor.mode.includes("Offline") && (

                <button
                  onClick={() => setMode("Offline")}
                  className={`flex items-center gap-2 rounded-xl border px-6 py-4

                  ${
                    mode === "Offline"
                      ? "bg-purple-600 text-white"
                      : ""
                  }`}
                >

                  <Building2 size={18} />

                  In Person

                </button>

              )}

            </div>

          </div>

          {/* Reason */}

          <div className="mt-8">

            <label className="font-semibold flex items-center gap-2">

              <FileText size={18} />

              Primary Concern

            </label>

            <select
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              className="mt-3 w-full rounded-xl border p-4"
            >

              <option value="">

                Select your concern

              </option>

              {reasons.map((item) => (

                <option
                  key={item}
                  value={item}
                >

                  {item}

                </option>

              ))}

            </select>

          </div>

          {/* Notes */}

          <div className="mt-8">

            <label className="font-semibold flex items-center gap-2">

              <NotebookPen size={18} />

              Additional Notes (Optional)

            </label>

            <textarea
              rows={5}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Share any additional information that may help the counsellor prepare for your session..."
              className="mt-3 w-full rounded-xl border p-4"
            />

          </div>

          {/* Consent */}

          <div className="mt-8 rounded-2xl bg-purple-50 border border-purple-200 p-6">

            <label className="flex gap-4">

              <input
                type="checkbox"
                checked={consent}
                onChange={(e) =>
                  setConsent(e.target.checked)
                }
              />

              <div>

                <div className="flex items-center gap-2">

                  <ShieldCheck size={18} />

                  <span className="font-semibold">

                    Privacy & Consent

                  </span>

                </div>

                <p className="mt-3 text-gray-600 leading-7">

                  I understand that this appointment request
                  is confidential. My information will only
                  be used for scheduling and counselling
                  purposes. This platform provides access to
                  student wellbeing services and does not
                  replace emergency mental health care.

                </p>

              </div>

            </label>

          </div>

          {/* Button */}

          <Button

            size="lg"

            className="w-full mt-10"

            onClick={handleBooking}

          >

            Confirm Booking

          </Button>

        </div>

      </div>

    </div>

  );

}