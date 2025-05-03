
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to the specified Supabase storage bucket
 * 
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path within the bucket
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (
  file: File, 
  bucket: 'product_images' | 'receipt_images' | 'avatars',
  folder: string = ''
): Promise<string> => {
  try {
    // Generate a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error(`Error uploading file to ${bucket}:`, error);
    throw new Error(`Failed to upload file: ${(error as Error).message}`);
  }
};

/**
 * Deletes a file from Supabase storage
 * 
 * @param url - The URL of the file to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export const deleteFile = async (url: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const urlParts = url.split('/');
    const bucket = urlParts[urlParts.length - 2];
    const path = urlParts[urlParts.length - 1];

    // Delete the file
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
