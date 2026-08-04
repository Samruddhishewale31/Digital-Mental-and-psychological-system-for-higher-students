export interface Appointment {

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

  status: "Confirmed" | "Cancelled" | "Completed";

  bookedAt: string;

  studentName: string;

  email: string;

  phone: string;

  anonymous: boolean;

}

export function saveAppointment(
  appointment: Appointment
) {

  const appointments: Appointment[] = JSON.parse(

    localStorage.getItem("appointments") || "[]"

  );

  appointments.push(appointment);

  localStorage.setItem(

    "appointments",

    JSON.stringify(appointments)

  );

}

export function getAppointments(): Appointment[] {

  return JSON.parse(

    localStorage.getItem("appointments") || "[]"

  );

}

export function updateAppointments(

  appointments: Appointment[]

) {

  localStorage.setItem(

    "appointments",

    JSON.stringify(appointments)

  );

}

export function cancelAppointment(

  bookingId: string

) {

  const appointments = getAppointments();

  const updated = appointments.map((appointment) =>

    appointment.bookingId === bookingId

      ? {

          ...appointment,

          status: "Cancelled" as const,

        }

      : appointment

  );

  updateAppointments(updated);

}

export function completeAppointment(

  bookingId: string

) {

  const appointments = getAppointments();

  const updated = appointments.map((appointment) =>

    appointment.bookingId === bookingId

      ? {

          ...appointment,

          status: "Completed" as const,

        }

      : appointment

  );

  updateAppointments(updated);

}