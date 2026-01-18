import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Label
  } from "recharts";
  import SwagItem from "@/app/projects/page";
  
  
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as typeof SwagItem;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg max-w-[200px]">
          <div className="h-24 w-full bg-gray-100 mb-2 rounded overflow-hidden">
               <img src={data.photoUrl} alt={data.name} className="h-full w-full object-cover" />
          </div>
          <p className="font-bold text-gray-900 text-sm">{data.name}</p>
          <p className="text-xs text-gray-500 mb-1">{data.company}</p>
          <p className="text-xs text-gray-600 line-clamp-2">{data.description}</p>
        </div>
      );
    }
    return null;
  };
  
  export function SwagChart({ data }: { data: SwagItem[] }) {
    return (
      <div className="relative w-full h-full">
        {/* Quadrant Labels (Absolute positioned for style) */}
        <div className="absolute top-2 right-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">High Value (Useful & Creative)</div>
        <div className="absolute bottom-10 left-12 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Junk (Useless & Boring)</div>
  
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            
            {/* X Axis: Creativity */}
            <XAxis 
              type="number" 
              dataKey="creativity" 
              name="Creativity" 
              domain={[-1, 1]} 
              tickCount={5}
              stroke="#666"
            >
              <Label value="Creativity" offset={0} position="insideBottom" />
            </XAxis>
  
            {/* Y Axis: Usefulness */}
            <YAxis 
              type="number" 
              dataKey="usefulness" 
              name="Usefulness" 
              domain={[-1, 1]} 
              tickCount={5}
              stroke="#666"
            >
              <Label value="Usefulness" angle={-90} position="insideLeft" />
            </YAxis>
  
            {/* The Crosshair (0,0) */}
            <ReferenceLine x={0} stroke="#000" strokeWidth={2} />
            <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
  
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            <Scatter name="Swag Items" data={data} fill="#2563eb" r={6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }