import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ProfileShell } from "@/components/profile-shell";
import { getPublicProfileBySlug } from "@/lib/db";
import { mapPublicApiProfileToProfileData } from "@/lib/public-profile-adapter";
import type { PublicProfileApi } from "@/lib/site-api";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string }>;
}

function resolvePngFavicon(profileImageUrl: string | null | undefined): Metadata["icons"] | undefined {
  if (!profileImageUrl) return undefined;
  if (!/\.png(?:$|[?#])/i.test(profileImageUrl)) return undefined;
  return { icon: profileImageUrl };
}

const fetchPublicProfile = cache(async (
  username: string,
  recruiterMode: boolean,
): Promise<PublicProfileApi | null> => {
  try {
    return await getPublicProfileBySlug(username, recruiterMode);
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
  searchParams,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const query = await searchParams;
  const recruiterMode = query.view === "recruiter";
  const publicProfile = await fetchPublicProfile(username, recruiterMode);

  if (!publicProfile) {
    return {
      title: "Profile Not Found | foliopage",
    };
  }

  return {
    title: `${publicProfile.name} | foliopage`,
    icons: resolvePngFavicon(publicProfile.profileImageUrl),
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { username } = await params;
  const query = await searchParams;
  const recruiterMode = query.view === "recruiter";
  const publicProfile = await fetchPublicProfile(username, recruiterMode);

  if (!publicProfile) {
    notFound();
  }

  const profile = mapPublicApiProfileToProfileData(publicProfile);

  return (
    <>
      <ProfileShell profile={profile} recruiterMode={recruiterMode} />
    </>
  );
}
