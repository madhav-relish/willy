"use client";
import { apiClient } from "@/lib/api";
import { useNotification } from "@/store/useNotification";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const GithubIntegrationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setGithubNotifications } = useNotification();

  useEffect(() => {
    const fetchGithubNotifications = async () => {
      try {
        setLoading(true);
        const response = await apiClient("/auth/github/all-notifications");
        setNotifications(response.data);
        setGithubNotifications(response.data)
      } catch (error) {
        setError("Failed to fetch notifications");
        console.error("Error while fetching github notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubNotifications();
  }, []);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>GitHub Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        <ul>
          {notifications.map((notification: any) => (
            <li
              className="my-2 "
              key={notification.id}
            >
                <div className="flex items-center gap-2  hover:cursor-pointer hover:bg-gray-700 rounded-2xl">

              <Link className="flex items-center gap-2" href={`${notification?.repository?.html_url}`} target="_blank">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`${notification.repository.owner.avatar_url}`}
                  />{" "}
                {notification.subject?.title}
              </Link>
                  </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GithubIntegrationComponent;
