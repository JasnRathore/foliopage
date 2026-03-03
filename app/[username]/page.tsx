import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProfileShell } from "@/components/profile-shell";
import { mapPublicApiProfileToProfileData } from "@/lib/public-profile-adapter";
import type { PublicProfileApi } from "@/lib/site-api";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string }>;
}

function getApiBaseUrl(hostHeader: string | null, protoHeader: string | null): string {
  if (hostHeader) {
    const protocol = protoHeader ?? (hostHeader.includes("localhost") ? "http" : "https");
    return `${protocol}://${hostHeader}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

async function fetchPublicProfile(
  username: string,
  recruiterMode: boolean,
): Promise<PublicProfileApi | null> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto");
  const baseUrl = getApiBaseUrl(host, proto);
  const query = recruiterMode ? "?view=recruiter" : "";

  const response = await fetch(
    `${baseUrl}/api/public/${encodeURIComponent(username)}${query}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    ok: boolean;
    data?: {
      profile: PublicProfileApi;
    };
  };

  if (!payload.ok || !payload.data?.profile) {
    return null;
  }

  return payload.data.profile;
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
