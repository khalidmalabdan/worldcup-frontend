export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import MatchesClient from "./MatchesClient";

export default function Page() {
  return <MatchesClient />;
}