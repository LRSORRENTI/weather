import { Skeleton } from "@/components/ui/skeleton";

function WeatherSkeleton() {
  return (
    <div className="main-card-wrap flex justify-center flex-col">
      {/* Main Weather Card Skeleton */}
      <div className="sec-wrap flex justify-center" >
      <div className="skeleton-card flex flex-col justify-center rounded-lg p-4" style={{border: "2px solid skyblue", width: "350px", height: "230px"}}>
        {/* Date and Time Skeleton */}
        <div className="flex justify-between mt-16">
          <Skeleton className="w-28 h-6 rounded mb-12" />
          <Skeleton className="w-28 h-6 rounded" />
        </div>
        <div className="flex justify-center">
        <div className="skele-wrap flex flex-col justify-center pb-5">
        <Skeleton className="w-48 h-6 rounded mb-4"/>
        <div className="flex justify-center">
        <Skeleton className="w-32 h-10 rounded mb-10"/>
        </div>
        </div>
        </div>
        </div>
        {/* Current Temperature Skeleton */}
        {/* <div className="flex flex-col items-center my-4">
          <Skeleton className="w-32 h-8 rounded" />
          <Skeleton className="w-16 h-12 rounded" />
        </div> */}
      </div>
      
      {/* Hourly Forecasts Skeleton */}
      <div className="flex justify-center flex-col items-center mt-12">
        <Skeleton className="w-32 h-10" />
        <div className="hourly-temp-wrap flex flex-wrap justify-evenly" style={{maxWidth: "700px"}}>
          {Array(27).fill().map((_, index) => (
            <Skeleton key={index} className="w-48 h-12 m-2 rounded-md" style={{border: "2px solid skyblue"}} />
          ))}
        </div>
      </div>
    </div>
  );
}


export default WeatherSkeleton