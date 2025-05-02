'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface Booking {
  id: string;
  date: string;
  status: string;
  service: {
    name: string;
    price: number;
    hospital: {
      name: string;
      location: string;
    };
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  if (status === 'loading') {
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
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <p>Welcome, {session?.user?.name || session?.user?.email}</p>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Bookings</h2>
            <Link
              href="/hospitals"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Book New Appointment
            </Link>
          </div>

          {loading ? (
            <p>Loading your bookings...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : bookings.length === 0 ? (
            <p>You don&apos;t have any bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Hospital</th>
                    <th className="p-3 text-left border">Service</th>
                    <th className="p-3 text-left border">Date & Time</th>
                    <th className="p-3 text-left border">Status</th>
                    <th className="p-3 text-left border">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{booking.service.hospital.name}</td>
                      <td className="p-3 border">{booking.service.name}</td>
                      <td className="p-3 border">{new Date(booking.date).toLocaleString()}</td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 border">${booking.service.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 