"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkIsSignedIn, getUser } from "../../../services/supabaseService";
import supabase from "../../../services/supabase";

export default function PerformancePage() {
  const router = useRouter();
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {

        const userData = await getUser();
        setUser(userData);

        // Fetch earnings data
        const { data: earningsData, error: earningsError } = await supabase
          .from('earnings')
          .select('*')
          .eq('artist_id', userData.id)
          .order('created_at', { ascending: false });

        if (earningsError) throw earningsError;

        setEarnings(earningsData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate totals
  const totalEarnings = earnings
    .filter(e => e.type === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalWithdrawals = earnings
    .filter(e => e.type === 'debit')
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);

  const currentBalance = totalEarnings - totalWithdrawals;

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
        <h2 className="text-2xl font-bold">Earnings</h2>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-gray-500">
              ${totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Withdrawals</h3>
            <p className="text-3xl font-bold text-gray-500">
              ${totalWithdrawals.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Available Balance</h3>
            <p className="text-3xl font-bold text-gray-500">
              ${currentBalance.toLocaleString()}
            </p>
            <div className="mt-4">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentBalance >= 100 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={currentBalance < 100}
              >
                Withdraw
              </button>
              <p className="text-xs text-gray-500 mt-2">Withdrawal threshold is $100</p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {earnings.map((earning, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm">
                        {new Date(earning.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          earning.type === 'credit' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {earning.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">
                        <span className={earning.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                          {earning.type === 'credit' ? '+' : '-'}${Math.abs(earning.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{earning.description}</td>
                      <td className="px-6 py-4">
                        {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          earning.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : earning.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {earning.status.toUpperCase()}
                        </span> */}
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
