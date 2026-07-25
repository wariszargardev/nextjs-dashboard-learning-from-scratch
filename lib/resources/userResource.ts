export function userResource(user:any){
    return {
        id:         user.id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        created_at: user.createdAt,
    }
}

export function userCollection(users: any[]){
    return users.map(userResource)
}