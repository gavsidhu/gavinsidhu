export type Activity = {
    id: number
    title: string
    type: ActivityType
    url: string
    message: string
    created_at: string;
    updated_at: string;
}

export type FeedProps = {
    activities: Activity[]
}

export type ActivityType = 'save' | 'read'; 
