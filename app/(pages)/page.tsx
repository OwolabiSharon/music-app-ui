"use client";

import React, { useState, useEffect } from "react";
import {
  checkIsSignedIn
} from "../services/supabaseService"; 
import { useRouter } from "next/navigation";
import supabase from "../services/supabase";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const validatAuth = async() => {
      if (await checkIsSignedIn()) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
      
    }

    const initializeApp = async() => {
      // Fetch page details first
      const { data: pageDetails, error } = await supabase
        .from('page_details')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching page details:', error);
      } else if (pageDetails) {
        console.log(pageDetails);
        
        // Store page details in localStorage
        localStorage.setItem('pageDetails', JSON.stringify(pageDetails));
      }


      if (await checkIsSignedIn()) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
    initializeApp()
    // validatAuth()
  }, []);

  return null;
}
