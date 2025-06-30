"use client";

import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import supabase from '../services/supabase';

interface WhatsAppLinkProps {
  className?: string;
}

export default function WhatsAppLink({ className = "" }: WhatsAppLinkProps) {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("639383089987");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        // First try to get from localStorage
        // const storedPageDetails = localStorage.getItem('pageDetails');
        // if (storedPageDetails) {
        //   const pageDetails = JSON.parse(storedPageDetails);
        //   if (pageDetails.whatsapp) {
        //     setWhatsappNumber(pageDetails.whatsapp);
        //     setLoading(false);
        //     return;
        //   }
        // }

        // If not in localStorage, fetch from Supabase
        const { data: pageDetails, error } = await supabase
          .from('page_details')
          .select('whatsapp')
          .limit(1)
          .single();

        if (error) throw error;

        if (pageDetails?.whatsapp) {
          const sanitizedNumber = pageDetails.whatsapp.replace(/\D/g, "");
          setWhatsappNumber(sanitizedNumber);
          // Store in localStorage for future use
        }

        console.log(pageDetails?.whatsapp, whatsappNumber)
      } catch (err) {
        console.error('Error fetching WhatsApp number:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWhatsAppNumber();
  }, []);

  if (loading) {
    return null; // Or a loading spinner if you prefer
  }
  if (className == "auth") {
    return (
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-medium text-green-600 hover:text-green-500 ${className}`}
      >
        Contact us on WhatsApp
      </a>
    );
  } else {
    return (
      <div className="p-3">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg transition-colors duration-200 font-medium w-full"
            >
              <FaWhatsapp className="text-xl" />
              <span>Contact Support</span>
            </a>
          </div>
    );
  }
} 
