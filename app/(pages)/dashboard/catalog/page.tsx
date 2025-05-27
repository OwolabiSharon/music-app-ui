"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkIsSignedIn, getUser } from "../../../services/supabaseService";
import supabase from "../../../services/supabase";

export default function CatalogPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {

        const userData = await getUser();
        setUser(userData);

        // Fetch songs data
        const { data: songsData, error: songsError } = await supabase
          .from('songs')
          .select('*')
          .eq('artist_id', userData.id)
          .order('created_at', { ascending: false });

        if (songsError) throw songsError;

        setSongs(songsData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load songs data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Catalog</h1>
          <button
            onClick={() => router.push('/dashboard/catalog/upload')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Upload New Song
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Track</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Release Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Platforms</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {songs.map((song, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={song.image_url || "/default-cover.png"}
                          alt={song.title}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{song.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{song.genre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {song.type?.toUpperCase() || 'SONG'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        song.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : song.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {song.status?.toUpperCase() || 'DRAFT'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {song.release_date ? new Date(song.release_date).toLocaleDateString() : 'Not set'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {song.platforms?.map((platform: string, i: number) => (
                          <span 
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <a
                          href={song.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          Play →
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
