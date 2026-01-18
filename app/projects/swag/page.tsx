// "use client";

// import { useState } from "react";
// import { SwagTable } from "@/app/projects/swag/components/swag-table"
// import { SwagChart } from "@/app/projects/swag/components/swag-axis"
// import swagData from "@/app/projects/swag/data/swag-data.json";

// export type SwagItem = {
//   id: string;
//   name: string;
//   company: string;
//   description: string;
//   photoUrl: string;
//   usefulness: number; // -1 to 1
//   creativity: number; // -1 to 1
// };

// export default function SwagPage() {
//   const [view, setView] = useState<"table" | "chart">("table");

//   return (
//     <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
//       <div className="max-w-5xl mx-auto">
        
//         {/* Header & Toggle */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold tracking-tight">every free thing i've gotten from companies I have worked at</h1>
          
//           <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm mt-4 sm:mt-0">
//             <button
//               onClick={() => setView("table")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                 view === "table" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               all
//             </button>
//             <button
//               onClick={() => setView("chart")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                 view === "chart" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               mapped out
//             </button>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {view === "table" ? (
//             <SwagTable data={swagData} />
//           ) : (
//             <div className="h-[600px] w-full p-6">
//               <SwagChart data={swagData} />
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }