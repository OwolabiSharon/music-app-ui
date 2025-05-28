"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">DISTROKIT DISTRIBUTION TERMS AND CONDITIONS</h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-semibold">Digital Publishing and Distribution Service</h2>
        
        <p>
          By using our services/platform, you agree to be bound by all terms and conditions of this Agreement, 
          as amended from time to time. If you don't agree, please don't use our services.
        </p>

        <p>
          DISTROKIT DISTRIBUTION reserves the right to modify these terms at any time, without notice, 
          by posting changes on the Site. If we make significant changes, we'll notify you by email. 
          If you don't accept the changes, stop using our Service. Continued use means you accept the changes.
        </p>

        <h2 className="text-2xl font-semibold">Terms and Conditions:</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">1. Royalties/Accounting/Subscription</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We pay 100% of net profit from our distribution partners for streaming/licensed uses of your 
                Digital Masters (based on performance on streaming platforms).
              </li>
              <li>
                Withdrawals require a minimum threshold of £100. Payment constitutes full consideration for 
                rights granted and obligations undertaken.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">2. Right to Withdraw Material</h3>
            <p>You can withdraw permission for sale/other uses of Your Authorized Content</p>
          </div>
        </div>
      </div>
    </div>
  );
} 