'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/clientApp';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Button from '@/components/ui/Button';

interface Event {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt?: any;
  date?: any;
  location?: string;
  status?: string;
  [key: string]: any;
}

export default function AdminEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'events'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
        <Button variant="outline" onClick={loadEvents}>
          Refresh
        </Button>
      </div>

      {/* Events Table */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No events found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Creator</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      {event.title}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {event.createdBy.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {event.date?.toDate ? event.date.toDate().toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {event.location || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {event.createdAt?.toDate ? event.createdAt.toDate().toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.removed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {event.removed ? 'Removed' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        Showing {events.length} event{events.length !== 1 ? 's' : ''}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Event moderation is typically done through the Reports queue.
          This page provides an overview of all events in the system.
        </p>
      </div>
    </div>
  );
}
