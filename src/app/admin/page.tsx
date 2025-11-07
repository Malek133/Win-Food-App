// import { requireAdmin, getCurrentUser } from "@/lib/auth-utils";
// // import AdminProductsManager from "@/components/AdminProductsManager";

// export default async function AdminPage() {
//     await requireAdmin(); // Redirige si pas admin
//     const user = await getCurrentUser();

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-2">Administration</h1>
//             <p className="text-gray-600 mb-6">Bienvenue {user?.name || user?.email}</p>
//             {/* <AdminProductsManager /> */}
//             Admin Product Manager
//         </div>
//     );
// }