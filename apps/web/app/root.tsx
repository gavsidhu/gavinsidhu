import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    json,
    useLocation,
} from "@remix-run/react";
import { Linkedin, Mail } from "lucide-react";
import stylesheet from "~/globals.css"
import { Icons } from "./components/icons";

export const links: LinksFunction = () => [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    { rel: "stylesheet", href: stylesheet },
];

const navigation = [
    { path: "/", name: 'Activity' },
    { path: "/projects", name: 'Projects' }
]

export async function loader() {
    return json({
        ENV: {
            FRONTEND_URL: process.env.FRONTEND_URL,
        },
    });
}

export default function App() {
    const location = useLocation()
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <main className=" bg-background text-white ">
                    <div className="w-full md:px-4 flex flex-col md:flex-row">
                        <div className="md:w-1/2 h-1/2 px-6 w-full flex-none relative mx-auto md:h-screen">
                            <div className="md:mt-24 mt-8 max-w-lg mx-auto">
                                <div className="space-y-4">
                                    <h1 className="text-5xl font-bold">Hi, I&#39;m Gavin Sidhu</h1>
                                    <p className="text-lg">I&#39;m a full-stack developer based in California and enjoy exploring new technologies and pushing the boundaries of web development.</p>
                                </div>
                                <ul className="flex space-y-8 py-14 max-w-lg mx-auto flex-col">
                                    {navigation.map((route, idx) => {
                                        const pathname = location.pathname
                                        const isCurrent = pathname === route.path
                                        if (isCurrent) {
                                            return (
                                                <li key={idx}>
                                                    <a href={route.path} className="inline-flex py-1 items-center text-white transition group">
                                                        <span className="inline-block w-20 h-px mx-16 -mt-px bg-white transition duration-500"></span>
                                                        <span className="text-xs text-white tracking-widest uppercase">{route.name}</span>
                                                    </a>
                                                </li>
                                            )
                                        } else {
                                            return (
                                                <li key={idx}>
                                                    <a href={route.path} className="inline-flex py-1 items-center hover:text-white transition group">
                                                        <span className="inline-block w-12 h-px mx-16 -mt-px group-hover:w-20 bg-gray-400 group-hover:bg-white transition duration-500"></span>
                                                        <span className="text-xs text-gray-400 group-hover:text-white tracking-widest uppercase">{route.name}</span>
                                                    </a>
                                                </li>
                                            )
                                        }
                                    })}
                                </ul>

                                <div className="flex absolute md:fixed md:bottom-4 bottom-0 items-center space-x-5 mt-6">
                                    <a href="mailto:gavinjeet.sidhu@gmail.com">
                                        <Mail className="h-6 w-6" />
                                    </a>
                                    <a href="https://www.github.com/gavsidhu">
                                        <Icons.gitHub className="h-6 w-6" />
                                    </a>
                                    < a href="https://www.linkedin.com/in/gavinjeetsidhu/">
                                        <Linkedin className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 md:overflow-y-auto md:h-screen flex flex-col">
                            <div className="md:mt-24 mt-8">
                                <Outlet />
                            </div>
                        </div>

                    </div>
                </main>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
