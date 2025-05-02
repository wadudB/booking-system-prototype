"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  hospital: {
    id: string;
    name: string;
    location: string;
  };
}

export default function BookingPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchService = useCallback(async () => {
    try {
      const response = await fetch("/api/hospitals");

      if (!response.ok) {
        throw new Error("Failed to fetch service data");
      }

      const hospitals = await response.json();

      // Find the service of all hospitals
      let foundService = null;
      let foundHospital = null;

      for (const hospital of hospitals) {
        const service = hospital.services.find(
          (s: { id: string }) => s.id === serviceId
        );
        if (service) {
          foundService = service;
          foundHospital = hospital;
          break;
        }
      }

      if (!foundService || !foundHospital) {
        throw new Error("Service not found");
      }

      setService({
        ...foundService,
        hospital: {
          id: foundHospital.id,
          name: foundHospital.name,
          location: foundHospital.location,
        },
      });
    } catch (error) {
      console.error("Error fetching service:", error);
      setError("Failed to load service details");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && serviceId) {
      fetchService();
    } else if (!serviceId) {
      router.push("/hospitals");
    }
  }, [status, router, serviceId, fetchService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      setError("Please select a date and time");
      return;
    }

    const dateTime = new Date(`${date}T${time}`);

    if (isNaN(dateTime.getTime())) {
      setError("Invalid date or time");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          date: dateTime.toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create booking");
      }

      setSuccess(true);

      // Redirect after a brief delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create booking"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen flex-col p-8 bg-gray-100">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Loading...</h1>
        </div>
      </main>
    );
  }

  if (error && !service) {
    return (
      <main className="flex min-h-screen flex-col p-8 bg-gray-100">
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/hospitals"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Hospitals
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col p-8 bg-gray-100">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Book Appointment</h1>
              <Link
                href="/hospitals"
                className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back
              </Link>
            </div>

            {success ? (
              <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
                Booking successful! Redirecting to dashboard...
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                  <p className="text-gray-600 mb-1">{service.hospital.name}</p>
                  <p className="text-gray-600 mb-3">
                    {service.hospital.location}
                  </p>

                  {service.description && (
                    <p className="text-gray-700 mb-3">{service.description}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <p>Duration: {service.duration} minutes</p>
                    <p className="font-semibold text-lg">
                      ${service.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      submitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting ? "Processing..." : "Book Appointment"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
