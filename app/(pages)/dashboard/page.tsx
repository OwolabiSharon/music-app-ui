"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkIsSignedIn, getUser, signOut } from "../../services/supabaseService";
import supabase from "../../services/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [user, setUser] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [pageDetails, setPageDetails] = useState<any>(null);

  useEffect(() => {
    const validateAuth = async() => {
      if (!await checkIsSignedIn()) {
        router.push("/auth/login");
      } else {
        const userData = await getUser();
         setUser(userData);
        
        // Get page details from localStorage
        const storedPageDetails = localStorage.getItem('pageDetails');
        if (storedPageDetails) {
          setPageDetails(JSON.parse(storedPageDetails));
          console.log(pageDetails);
          
        }
        console.log(pageDetails, userData, user);
        // Fetch songs for the artist
        const { data: songsData, error } = await supabase
          .from('songs')
          .select('*')
          .eq('artist_id', userData.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching songs:', error);
        } else {
          setSongs(songsData || []);
        }
      }
    }
    validateAuth();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <div className="h-full">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
              {user?.first_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Hi, {user?.first_name || "User"}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Welcome back to your dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Songs</h3>
            <p className="text-3xl font-bold text-blue-600">{songs.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Active Providers</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
            <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
          </div>
        </div>

        {/* Latest Releases Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Latest Releases</h2>
            <button
              onClick={() => router.push("/dashboard/catalog")}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {songs.map((song, index) => (
              <a
                key={index}
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <div className="aspect-square relative">
                    <img
                      src={song.cover_image_url}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {song.type?.toUpperCase() || 'SONG'}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{song.title}</h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* WordPress Blog Section */}
        {pageDetails?.blog_url && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Latest Blog Posts</h2>
              <a
                href={pageDetails.blog_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
              >
                Visit Blog →
              </a>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <iframe
                src={pageDetails.blog_url}
                className="w-full h-[600px] border-0"
                title="WordPress Blog"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        {/* <div className="mt-8">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div> */}
      </div>
    </div>
  );
}

