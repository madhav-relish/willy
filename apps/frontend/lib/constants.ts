import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    StepForwardIcon,
  } from "lucide-react"

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT


export const sidebarMenu = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Rooms",
        url: "/chat",
        icon: SquareTerminal,
        isActive: true,
        items: [
          
        ],
      },

      {
        title: "Integrations",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "GitHub",
            url: "/integrations/github",
          },
          {
            title: "Discord",
            url: "#",
          },
          {
            title: "Slack",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }


 export const integrations = [
    { name: 'GitHub', logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', description: 'A platform for version control and collaboration.' },
    { name: 'Discord', logo: 'https://cdn.worldvectorlogo.com/logos/discord-logo.svg', description: 'A voice, video, and text communication service.' },
    { name: 'Slack', logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', description: 'A messaging app for teams.' },
    { name: 'Notion', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg', description: 'An all-in-one workspace for notes, tasks, and collaboration.' },
]