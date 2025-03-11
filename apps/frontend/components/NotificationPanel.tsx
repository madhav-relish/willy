//@ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";

type Props = {};

const NotificationPanel = (props: Props) => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const { githubNotifications } = useNotification();

  const handleFilterNotifications = () => {
    // Filter notifications based on the filter state

    // TODO:: Fix the ts error for notification
    const filteredNotifications = githubNotifications.filter((notification) =>
      filter === "all"
        ? githubNotifications
        : filter === "unread"
          ? notification?.unread === true
          : null
    );
    setNotifications(filteredNotifications);
    console.log(notifications)
  };

  useEffect(() => {
    handleFilterNotifications();
  }, [filter, githubNotifications]);

  return (
    <Sheet>
      <SheetTrigger>
        <BellIcon size={16} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <Tabs defaultValue="github" className="w-full">
              <div className="flex items-center justify-between gap-2">
                <TabsList>
                  <TabsTrigger value="github">Github</TabsTrigger>
                  <TabsTrigger value="discord">Discord</TabsTrigger>
                  <TabsTrigger value="slack">Slack</TabsTrigger>
                </TabsList>

                <Button
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "" : "bg-gray-400"}
                >
                  All
                </Button>
                <Button
                  onClick={() => setFilter("unread")}
                  className={filter === "unread" ? "" : "bg-gray-400"}
                >
                  Unread
                </Button>
              </div>
              <TabsContent className="h-screen overflow-y-auto" value="github">
                {notifications.length === 0 ? (
                  <p>No notifications found</p>
                ) : (
                  <ul className="">
                    {notifications.map((notification: any) => (
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
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
