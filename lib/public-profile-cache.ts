import { unstable_cache } from "next/cache";
import { getPublicProfileBySlug, type DbPublicProfile } from "@/lib/db";

const getCachedPublicProfile = unstable_cache(
  async (slug: string, recruiterMode: boolean): Promise<DbPublicProfile | null> => {
    try {
      return await getPublicProfileBySlug(slug, recruiterMode);
    } catch {
      return null;
    }
  },
  ["public-profile-by-slug"],
  { revalidate: 300 },
);

export async function getCachedPublicProfileBySlug(
  slug: string,
  recruiterMode: boolean,
): Promise<DbPublicProfile | null> {
  return getCachedPublicProfile(slug.trim().toLowerCase(), recruiterMode);
}

