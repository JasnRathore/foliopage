import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DynamicFavicon } from "@/components/dynamic-favicon";
import { ProfileShell } from "@/components/profile-shell";
import { mapPublicApiProfileToProfileData } from "@/lib/public-profile-adapter";
import type { PublicProfileApi } from "@/lib/site-api";
import { getChildPageBySegments, getProfileByUsername } from "@/lib/profile-data";

interface ChildPageProps {
  params: Promise<{ username: string; childpages: string[] }>;
  searchParams: Promise<{ view?: string }>;
}

function resolvePngFavicon(profileImageUrl: string | null | undefined): Metadata["icons"] | undefined {
  if (!profileImageUrl) return undefined;
  if (!/\.png(?:$|[?#])/i.test(profileImageUrl)) return undefined;
  return { icon: profileImageUrl };
}

function resolvePngFaviconUrl(profileImageUrl: string | null | undefined): string {
  if (!profileImageUrl) return "/favicon.ico";
  return /\.png(?:$|[?#])/i.test(profileImageUrl) ? profileImageUrl : "/favicon.ico";
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

export async function generateMetadata({
  params,
}: ChildPageProps): Promise<Metadata> {
  const { username, childpages } = await params;
  const staticProfile = getProfileByUsername(username);
  const profile = await fetchPublicProfile(username, false);

  if (!staticProfile || !profile) {
    return {
      title: "Profile Not Found | foliopage",
    };
  }

  const childPage = getChildPageBySegments(staticProfile, childpages);

  if (!childPage) {
    return {
      title: `${profile.name} | foliopage`,
      icons: resolvePngFavicon(profile.profileImageUrl),
    };
  }

  return {
    title: `${childPage.title} | ${profile.name} | foliopage`,
    description: childPage.subtitle,
    icons: resolvePngFavicon(profile.profileImageUrl),
  };
}

export default async function ChildPage({ params, searchParams }: ChildPageProps) {
  const { username, childpages } = await params;
  const query = await searchParams;
  const recruiterMode = query.view === "recruiter";
  const publicProfile = await fetchPublicProfile(username, recruiterMode);
  const staticProfile = getProfileByUsername(username);

  if (!publicProfile || !staticProfile) {
    notFound();
  }

  const childPage = getChildPageBySegments(staticProfile, childpages);

  if (!childPage) {
    notFound();
  }

  const profile = mapPublicApiProfileToProfileData(publicProfile);
  const faviconHref = resolvePngFaviconUrl(publicProfile.profileImageUrl);

  return (
    <>
      <DynamicFavicon href={faviconHref} />
      <ProfileShell
        profile={profile}
        childPage={childPage}
        recruiterMode={recruiterMode}
      />
    </>
  );
}
