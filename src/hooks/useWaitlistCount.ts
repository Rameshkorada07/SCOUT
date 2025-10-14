import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const BASE_COUNT = 207; // Starting from 207
const TARGET_COUNT = 1000;

export const useWaitlistCount = () => {
  const [count, setCount] = useState(BASE_COUNT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial count
    const fetchCount = async () => {
      try {
        const { count: dbCount, error } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching waitlist count:', error);
          return;
        }

        setCount(BASE_COUNT + (dbCount || 0));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching count:', error);
        setIsLoading(false);
      }
    };

    fetchCount();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('waitlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlist'
        },
        async () => {
          // Refetch count when changes occur
          const { count: dbCount } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true });

          setCount(BASE_COUNT + (dbCount || 0));
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const percentage = Math.min(100, Math.round((count / TARGET_COUNT) * 100));

  return {
    count,
    targetCount: TARGET_COUNT,
    percentage,
    isLoading
  };
};

