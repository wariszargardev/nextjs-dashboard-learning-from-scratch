import { postCollection } from "./postResource"

export function userResource(user:any){
    return {
        id:         user.id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        created_at: user.createdAt,

        // conditional — only include if relation was loaded
        ...(user.posts && { posts: postCollection(user.posts) }),
        ...(user._count && {
            postCount: user._count.posts,
            commentCount: user._count.comments
        })
    }
}

export function userCollection(users: any[]){
    return users.map(userResource)
}