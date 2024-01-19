import { MetaFunction } from "@remix-run/node";
import { Card, CardTitle, CardFooter, CardHeader, CardDescription } from "~/components/ui/card"

export const meta: MetaFunction = () => {
    return [
        { title: "Gavin Sidhu | Projects" },
        {
            property: "og:title",
            content: "Gavin Sidhu | Software Engineer | Projects",
        },
        {
            name: "description",
            content: "Gavin Sidhu | Software Engineer",
        },
    ];
};

const projects = [
    {
        title: "Miflo", primaryLanguage: "Go", description: "Miflo is a database schema migration tool that supports SQLite, PostgreSQL, and Turso/libSQL.", techStack: ["GoReleaser", "Github Actions", "Docker",
        ],
        href: "https://www.github.com/gavsidhu/miflo"
    },
    {
        title: "Story Starters", primaryLanguage: "TypeScript", description: "StoryStarters is an AI story writer that helps fiction writers write thier stories.", techStack: ["Next.js", "Firebase", "OpenAI",
        ],
        href: "https://www.github.com/gavsidhu/storystarters-app"
    },
    {
        title: "FairBite", primaryLanguage: "JavaScript", description: "An app that helps groups of friends decide where to eat.", techStack: ["React.js", "MongoDB", "Web Sockets", "Express.js"],
        href: "https://www.github.com/gavsidhu/storystarters-app"
    },

]

export default function Projects() {
    return (
        <div className="mx-auto max-w-lg group">
            {projects.map((project, idx) => (
                <ProjectCard key={idx} title={project.title} description={project.description} primaryLanguage={project.primaryLanguage} techStack={project.techStack} href={project.href} />
            ))}
        </div>
    )
}

type ProjectCardProps = {
    primaryLanguage: string
    title: string
    description: string
    techStack: string[]
    href: string
}

export function ProjectCard({ primaryLanguage, title, description, techStack, href }: ProjectCardProps) {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            <Card className="w-full rounded-none border border-white border-opacity-15 bg-foreground text-white hover:scale-110 duration-200 hover:shadow-lg">
                <CardHeader>
                    <p className="text-md text-picton-500 py-1 font-medium">{primaryLanguage}</p>
                    <CardTitle className="pb-1">{title}</CardTitle>
                    <CardDescription className="text-white">{description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex space-x-2">
                    {techStack.map((tech) => (
                        <p key={tech} className="text-sm text-muted-foreground">{tech}</p>
                    ))}
                </CardFooter>
            </Card>
        </a>
    )
}

export function ErrorBoundary() {
    return (
        <div>
            <h1 className="text-lg text-white text-center">
                There was an error getting projects
            </h1>
        </div>
    );

}
