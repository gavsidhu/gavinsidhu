import { formatIsoTimestamp } from "~/lib/utils"
import { Bookmark, LucideIcon, BookOpenCheck } from "lucide-react"
import { ActivityType, FeedProps } from "~/global";


const icons: { [key in ActivityType]: LucideIcon } = {
    save: Bookmark,
    read: BookOpenCheck,
};


function createMessage(title: string, type: string, url: string) {
    switch (type) {
        case "save":
            return <p className="text-sm text-white">I saved <a href={url} className="text-picton-500">{title}</a> for later</p>
        case "read":
            return <p className="text-sm text-white">I read <a href={url} className="text-picton-500">{title}</a></p>
        default:
            return null
    }
}


export default function ActivityFeed({ activities }: FeedProps) {
    return (
        <ul className="md:p-5">
            {activities.map((activity, activityIdx) => {
                const Icon = icons[activity.type];
                return (
                    <li key={activity.id} className={`py-5 px-2 bg-foreground border border-white border-opacity-15 hover:scale-110 duration-200 hover:shadow-lg ${activityIdx === activities.length - 1 ? 'mb-4' : ''}`}>
                        <div className="relative">
                            <div className="relative flex px-1 items-center space-x-5">
                                <div>

                                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                    <div className="truncate">
                                        {createMessage(activity.title, activity.type, activity.url)}
                                    </div>
                                    <div className="whitespace-nowrap text-right text-xs text-white">
                                        <time>{formatIsoTimestamp(activity.created_at)}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

