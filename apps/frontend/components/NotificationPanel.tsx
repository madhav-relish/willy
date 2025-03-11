import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellIcon } from "lucide-react";
import { useNotification } from "@/store/useNotification";
import Link from "next/link";

type Props = {};

const NotificationPanel = (props: Props) => {
  const { githubNotifications } = useNotification();
  return (
    <Sheet>
      <SheetTrigger>
        <BellIcon size={16} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <Tabs defaultValue="github" className="w-full">
              <TabsList>
                <TabsTrigger value="github">Github</TabsTrigger>
                <TabsTrigger value="discord">Discord</TabsTrigger>
                <TabsTrigger value="slack">Slack</TabsTrigger>
              </TabsList>
              <TabsContent className="overflow-y-auto" value="github">
                {githubNotifications.length === 0 ? (
                  <p>No notifications found</p>
                ) : (
                  <ul>
                    {githubNotifications.map((notification: any) => (
                      <Link
                        className=""
                        href={`${notification?.repository?.html_url}`}
                        target="_blank"
                      >
                        <li
                          className="flex items-center gap-2 py-2 text-sm hover:bg-blue-800 hover:cursor-pointer rounded-2xl"
                          key={notification.id}
                        >
                          <img
                            className="h-10 w-10 rounded-full"
                            src={`${notification.repository.owner.avatar_url}`}
                          />{" "}
                          {notification.subject?.title}
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </TabsContent>
              <TabsContent value="discord">
                All your Discord notifications will appear here.
              </TabsContent>
              <TabsContent value="slack">
                All your Slack notifications will appear here.
              </TabsContent>
            </Tabs>
          </SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
