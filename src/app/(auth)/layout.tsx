export const metadata = {
    title: 'Login - Admin Backoffice',
    description: 'Login to access the admin dashboard',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>{children}</>
    );
}
