import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerMember } from "./server-member";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ServerSidebarProps {
  serverId: string;
}

const ServerMembersSidebar = async ({ serverId }: ServerSidebarProps) => {

    const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  const members = server?.members.filter((member) => member.profileId !== profile.id)

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  const organizeMembersByDepartment = (members: any) => {
    const grouped = members.reduce((acc: any, member: any) => {
      const { department } = member.profile;
      const departmentKey = department || 'Sales Team'; // Use 'Unknown' for members without a department
      if (!acc[departmentKey]) {
        acc[departmentKey] = [];
      }
      acc[departmentKey].push(member);
      return acc;
    }, {});
  
    return grouped;
  };
  
  const groupedMembers: any = organizeMembersByDepartment(members);

  return (
    <div className="flex flex-col w-80 h-full text-primary bg-[#F2F3F5] dark:bg-[#171717]">
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-2">Members</h2>
          <Accordion type="single" collapsible>
            {Object.entries(groupedMembers).map(([department, members]: any, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{department}</AccordionTrigger>
                <AccordionContent>
                  {members.map((member: any) => (
                    <ServerMember key={member.id} member={member} server={server} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerMembersSidebar;
