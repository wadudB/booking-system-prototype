"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Hospital {
  id: string;
  name: string;
  location: string;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

export default function HospitalsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchHospitals();
    }
  }, [status, router]);

  const fetchHospitals = async () => {
    try {
      const response = await fetch("/api/hospitals");

      if (!response.ok) {
        throw new Error("Failed to fetch hospitals");
      }

      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError("Failed to load hospitals");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen flex-col p-8 bg-gray-100">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-8 bg-gray-100">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Hospitals</h1>
          <Link
            href="/dashboard"
            className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {error ? (
          <p className="text-red-600">{error}</p>
        ) : hospitals.length === 0 ? (
          <p>No hospitals available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {hospital.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{hospital.location}</p>

                  <h3 className="text-lg font-medium mb-3">
                    Available Services
                  </h3>

                  {hospital.services.length === 0 ? (
                    <p>No services available.</p>
                  ) : (
                    <ul className="space-y-3">
                      {hospital.services.map((service) => (
                        <li key={service.id} className="border-b pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{service.name}</h4>
                              {service.description && (
                                <p className="text-sm text-gray-600">
                                  {service.description}
                                </p>
                              )}
                              <p className="text-sm">
                                Duration: {service.duration} minutes
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ${service.price.toFixed(2)}
                              </p>
                              <Link
                                href={`/booking?serviceId=${service.id}`}
                                className="inline-block mt-2 py-1 px-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Book Now
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
