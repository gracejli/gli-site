import { SwagItem } from "../page";

export function SwagTable({ data }: { data: SwagItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-100 text-gray-900 font-semibold border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Item</th>
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Metrics</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                    <img 
                      src={item.photoUrl} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-medium">{item.company}</td>
              <td className="px-6 py-4 max-w-xs truncate" title={item.description}>
                {item.description}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between">
                    <span>Useful:</span>
                    <span className={item.usefulness > 0 ? "text-green-600" : "text-red-500"}>
                      {item.usefulness}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creative:</span>
                    <span className={item.creativity > 0 ? "text-blue-600" : "text-orange-500"}>
                      {item.creativity}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}