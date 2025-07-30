import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';




export const useCloudinaryLinks = () => {
     const axiosSecure = useAxiosSecure();
     return useQuery({
          queryKey: ['cloudinaryLinks'],
          queryFn: async () => {
               const res = await axiosSecure.get('cloudinary/links');
               return res?.data || [];
          },
          staleTime: 1000 * 60 * 5, // optional: cache for 5 minutes
          refetchOnWindowFocus: false, // optional: prevent refetch on tab switch
          // ✅ REMOVE enabled: false to allow auto-fetch
     });
};