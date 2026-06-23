import React from "react"

export default function PostLayout({children}: {
    children: React.ReactNode
}){
    return (
         <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between">Post Layout</h1>
                {children}
            </main>
    </div>
    )
}