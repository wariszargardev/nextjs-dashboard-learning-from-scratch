
export function postResource(post: any){
    return {
        id: post.id,
        title: post.title,
        published: post.published
    }
}

export function postCollection(posts: any[]){
    return posts.map(postResource)
}