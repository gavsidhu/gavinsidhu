import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import ActivityFeed from "~/components/ActivityFeed";
import { Activity } from "~/global";
import { useActivity } from "~/hooks/useActivity";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Input } from "~/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon, ListFilter, SearchIcon } from "lucide-react";

export const meta: MetaFunction = () => {
    return [
        { title: "Gavin Sidhu | Activity" },
        {
            property: "og:title",
            content: "Gavin Sidhu | Software Engineer | Activity",
        },
        {
            name: "description",
            content: "Gavin Sidhu | Software Engineer",
        },
        {
            property: "og:image",
            content: `https://www.gavinsidhu.com/og.png`
        }
    ];
};


export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const pageSize = url.searchParams.get('pageSize') || 15;
    try {
        const response = await fetch(`${process.env.BACKEND_URL as string}/activity?page=${page}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Authorization": process.env.AUTH_TOKEN as string
            },
            credentials: 'include'
        });

        const inbox = await response.json() as { activities: Activity[], totalCount: number, page: number, pageSize: number };
        inbox["page"] = parseInt(page as string)
        inbox["pageSize"] = parseInt(pageSize as string)
        return json(inbox);
    } catch (error) {
        throw new Error('Failed to fetch activity');
    }
}

export default function Index() {
    const originalData = useLoaderData<typeof loader>();
    const { data: contextData, setData } = useActivity();
    const [displayData, setDisplayData] = useState(originalData.activities);
    const [query, setQuery] = useState("")
    const [position, setPosition] = useState("all");
    const [noResults, setNoResults] = useState(false);

    const applyFilters = useCallback((dataToFilter: Activity[]) => {
        let filteredData = dataToFilter;
        if (position === "all") {
            filteredData = dataToFilter;
        } else if (position === "save") {
            filteredData = filteredData.filter(activity => activity.type === "save");
        } else if (position === "read") {
            filteredData = filteredData.filter(activity => activity.type === "read");
        }
        setDisplayData(filteredData);
    }, [position]);

    useEffect(() => {
        if (contextData.length === 0) {
            setData(originalData.activities);
        }
    }, [originalData, contextData, setData]);

    useEffect(() => {
        applyFilters(originalData.activities);
    }, [originalData, applyFilters]);

    useEffect(() => {
        applyFilters(contextData);
    }, [contextData, applyFilters]);

    const handleClearSearch = () => {
        setQuery("");
        setNoResults(false)
        setData(originalData.activities);
    };

    if (!originalData || originalData.activities.length === 0) {
        return (
            <h1 className="text-lg text-white">No activity to display</h1>
        )
    }

    return (
        <div>
            <div>
                <div className="sticky w-full top-0 z-10 bg-black px-3 py-2 md:px-10 space-y-2">
                    <Search position={position} setPosition={setPosition} query={query} setQuery={setQuery} clearSearch={handleClearSearch} setNoResults={setNoResults} />
                    <PaginationBar totalCount={originalData.totalCount} pageNumber={originalData.page} pageSize={originalData.pageSize} />
                </div>
                <div className="px-6">
                    {noResults ? (
                        <div className="text-center text-gray-500">No results found</div>
                    ) : (
                        <div>
                            <ActivityFeed activities={displayData} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


type SearchProps = {
    position: string
    setPosition: React.Dispatch<React.SetStateAction<string>>
    clearSearch: () => void
    query: string
    setQuery: React.Dispatch<React.SetStateAction<string>>
    setNoResults: React.Dispatch<React.SetStateAction<boolean>>

};


function Search({ position, setPosition, query, setQuery, clearSearch, setNoResults }: SearchProps) {
    const { setData } = useActivity()

    const handleSearch = async () => {
        if (query === "") {
            return
        }
        const response = await fetch("/search?" + new URLSearchParams({ q: query }), {
            method: "GET",
        })

        const data = await response.json() as Activity[]

        if (!data) {
            setData([])
            setNoResults(true)
        } else {
            setData(data)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }


    return (
        <div className="flex items-center space-x-2">
            <div className="relative flex-1">
                <div className="flex items-center ">
                    <Input className="border-r-transparent rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <Button className="border border-l-transparent rounded-l-none -ml-0.5" onClick={handleSearch} variant="ghost">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </Button>
                    {query && (
                        <Button onClick={clearSearch} variant="ghost">
                            Clear
                        </Button>
                    )}
                </div>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline"><ListFilter className="h-5 w-5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                            <DropdownMenuRadioItem value="all">Show All</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="save">Bookmarks</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="read">Read</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

type PaginationProps = {
    totalCount: number
    pageNumber: number
    pageSize: number
}

function PaginationBar({ totalCount, pageNumber, pageSize }: PaginationProps) {
    const navigate = useNavigate()
    const totalPages = Math.ceil(totalCount / pageSize)

    const maxPages = 3
    const halfMaxPages = Math.floor(maxPages / 2)

    const canPageBackwards = pageNumber > 1
    const canPageForwards = pageNumber < totalPages


    const pages = getPageNumbers(totalPages)
    const isFirstPageIncluded = pages.includes(1)
    const isLastPageIncluded = pages.includes(totalPages);

    function getPageNumbers(totalPages: number) {
        const pageNumbers = [];
        if (totalPages <= maxPages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            let startPage = pageNumber - halfMaxPages
            let endPage = pageNumber + halfMaxPages
            if (startPage < 1) {
                endPage += Math.abs(startPage) + 1
                startPage = 1
            }
            if (endPage > totalPages) {
                startPage -= endPage - totalPages
                endPage = totalPages
            }
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i)
            }
        }
        return pageNumbers
    }

    function goToNextPage() {
        navigate({
            pathname: "/",
            search: `page=${pageNumber + 1}`
        })
    }

    function goToPreviousPage() {
        navigate({
            pathname: "/",
            search: `page=${pageNumber - 1}`
        })

    }

    return (
        <div>
            <div className="flex items-center justify-between py-2">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        className="relative inline-flex items-center rounded-md disabled:bg-gray-900 disabled:text-gray-400 border border-gray-300 px-3 py-2 text-sm font-medium text-white hover:bg-picton-950 hover:text-picton-300"
                        disabled={!canPageBackwards}
                        onClick={goToPreviousPage}

                    >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                        className="relative ml-3 inline-flex items-center rounded-md disabled:bg-gray-900 disabled:text-gray-400 border border-gray-300 px-3 py-2 text-sm font-medium text-white hover:bg-picton-950 hover:text-picton-300"
                        disabled={!canPageForwards}
                        onClick={goToNextPage}

                    >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                    <div>
                        <p className="text-xs md:text-sm text-white-700">
                            <span className="font-medium">{(pageNumber * pageSize) - 14}</span> to <span className="font-medium">{Math.min(pageNumber * pageSize, totalCount)}</span> of{' '}

                            <span className="font-medium">{totalCount}</span>
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                disabled={!canPageBackwards}
                                className="relative rounded-none inline-flex items-center disabled:bg-gray-900 disabled:text-gray-400 rounded-l-md px-2 py-2 text-white ring-1 ring-inset ring-gray-300 hover:bg-picton-950 hover:text-picton-300 focus:z-20 focus:outline-offset-0"
                                onClick={goToPreviousPage}

                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            {!isFirstPageIncluded && (
                                <span className="relative hidden items-center px-3 py-2 text-xs font-semibold text-white ring-1 ring-inset ring-gray-300 md:inline-flex">
                                    ...
                                </span>
                            )}
                            {pages.map((page) => {
                                const isCurrentPage = page === pageNumber
                                if (isCurrentPage) {
                                    return (
                                        <a
                                            href={`/?page=${page}`}
                                            key={page}
                                            className="relative px-3 py-2 text-sm font-semibold z-10 bg-picton-400 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            {page}
                                        </a>
                                    )
                                } else {
                                    return (
                                        <a
                                            href={`/?page=${page}`}
                                            key={page}
                                            className="relative hidden items-center px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-picton-950 hover:text-picton-300 focus:z-20 focus:outline-offset-0 md:inline-flex"
                                        >
                                            {page}
                                        </a>

                                    )
                                }
                            })}
                            {!isLastPageIncluded && (
                                <span className="relative hidden items-center px-3 py-2 text-xs font-semibold text-white ring-1 ring-inset ring-gray-300 md:inline-flex">
                                    ...
                                </span>
                            )}
                            <button
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 disabled:bg-gray-900 disabled:text-gray-400 text-gray-white ring-1 ring-inset ring-gray-300 hover:bg-picton-950 hover:text-picton-300 focus:z-20 focus:outline-offset-0"
                                disabled={!canPageForwards}
                                onClick={goToNextPage}
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

        </div>
    )
}


export function ErrorBoundary() {
    return (
        <div>
            <h1 className="text-lg text-white text-center">
                There was an error getting activity
            </h1>
        </div>
    );

}
