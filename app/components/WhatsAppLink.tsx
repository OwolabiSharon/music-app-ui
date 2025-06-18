"use client";

import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import supabase from '../services/supabase';

interface WhatsAppLinkProps {
  className?: string;
}

export default function WhatsAppLink({ className = "" }: WhatsAppLinkProps) {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("1234567890");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        // First try to get from localStorage
        const storedPageDetails = localStorage.getItem('pageDetails');
        if (storedPageDetails) {
          const pageDetails = JSON.parse(storedPageDetails);
          if (pageDetails.whatsapp) {
            setWhatsappNumber(pageDetails.whatsapp);
            setLoading(false);
            return;
          }
        }

        // If not in localStorage, fetch from Supabase
        const { data: pageDetails, error } = await supabase
          .from('page_details')
          .select('whatsapp')
          .limit(1)
          .single();

        if (error) throw error;

        if (pageDetails?.whatsapp) {
          setWhatsappNumber(pageDetails.whatsapp);
          // Store in localStorage for future use
          localStorage.setItem('pageDetails', JSON.stringify(pageDetails));
        }
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
} 