"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkIsSignedIn, getUser } from "../../../services/supabaseService";
import supabase from "../../../services/supabase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!await checkIsSignedIn()) {
          router.push("/auth/login");
          return;
        }

        const userData = await getUser();
        setUser(userData);

        // Fetch analytics data with joined songs
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('analytics')
          .select(`
            *,
            songs:song_id (
              title,
              cover_image_url,
              type,
              genre
            )
          `)
          .eq('songs.artist_id', userData.id)
          .order('created_at', { ascending: false });

        if (analyticsError) throw analyticsError;

        setAnalytics(analyticsData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate totals
  const totalPlays = analytics.reduce((sum, a) => sum + (a.plays || 0), 0);
  const totalRevenue = analytics.reduce((sum, a) => sum + (a.revenue || 0), 0);
  const totalDownloads = analytics.reduce((sum, a) => sum + (a.downloads || 0), 0);

  // Prepare monthly data for chart
  const monthlyData = analytics.reduce((acc: { [key: string]: number }, curr) => {
    const date = new Date(curr.created_at);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[monthYear] = (acc[monthYear] || 0) + (curr.plays || 0);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(monthlyData).sort(),
    datasets: [
      {
        label: 'Monthly Streams',
        data: Object.keys(monthlyData).sort().map(key => monthlyData[key]),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Streams',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Streams</h3>
            <p className="text-3xl font-bold text-blue-600">
              {totalPlays.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Downloads</h3>
            <p className="text-3xl font-bold text-purple-600">
              {totalDownloads.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <Bar options={chartOptions} data={chartData} />
        </div>

        {/* Analytics Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Song Performance</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Song</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Plays</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Downloads</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Revenue</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Platform</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analytics.map((analytic, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={analytic.songs?.cover_image_url || "/default-cover.png"}
                            alt={analytic.songs?.title}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium">{analytic.songs?.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {analytic.songs?.type?.toUpperCase()} • {analytic.songs?.genre}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">
                        {analytic.plays?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">
                        {analytic.downloads?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">
                        ${analytic.revenue?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {analytic.platform?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(analytic.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
