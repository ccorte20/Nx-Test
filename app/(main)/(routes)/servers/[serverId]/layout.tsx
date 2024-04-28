import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";
import ServerMembersSidebar from "@/components/server/serverMembersSidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  return ( 
    <div className="h-full flex flex-col md:flex-row">
    <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
      <ServerSidebar serverId={params.serverId} />
    </div>
    <main className="flex-1 h-full md:pl-60 md:pr-60">
      {children}
    </main>
    <div className="hidden md:flex h-full w-80 z-20 flex-col fixed inset-y-0 right-0">
      <ServerMembersSidebar serverId={params.serverId} />
    </div>
  </div>
   );
}
 
export default ServerIdLayout;