export default function SettingsLayout({children}: Readonly<{children: React.ReactNode}>){
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <ul>
                <li>Home</li>
                <li>Settings</li>
                <li>Admin</li>
            </ul>
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                {children}
            </main>
        </div>
    )
}