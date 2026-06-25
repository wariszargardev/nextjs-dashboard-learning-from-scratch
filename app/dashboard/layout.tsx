
export default function DashboardLayout(props: LayoutProps<'/dashboard'>) {
    return (
        <div>
            <h1>Dashboard Layout</h1>
            {props.children}
        </div>
    )
}
