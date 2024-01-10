import { Skeleton } from "@/components/ui/skeleton";

function WeatherSkeleton() {
  return (
    <div className="main-card-wrap flex justify-center">
      {/* Main Weather Card Skeleton */}
      <div className="skeleton-card rounded-lg p-4" style={{border: "2px solid skyblue", width: "350px"}}>
        {/* Date and Time Skeleton */}
        <div className="flex justify-between">
          <Skeleton className="w-24 h-6 rounded" />
          <Skeleton className="w-24 h-6 rounded" />
        </div>
        
        {/* Current Temperature Skeleton */}
        <div className="flex flex-col items-center my-4">
          <Skeleton className="w-32 h-8 rounded" />
          <Skeleton className="w-16 h-12 rounded" />
        </div>
      </div>
      
      {/* Hourly Forecasts Skeleton */}
      <div className="flex justify-center flex-col items-center">
        <Skeleton className="w-24 h-6 my-2" />
        <div className="hourly-temp-wrap flex flex-wrap justify-evenly" style={{maxWidth: "700px"}}>
          {Array(8).fill().map((_, index) => (
            <Skeleton key={index} className="w-32 h-12 m-2 rounded-md" style={{border: "2px solid skyblue"}} />
          ))}
        </div>
      </div>
    </div>
  );
}


export default WeatherSkeleton