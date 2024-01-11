import { Skeleton } from "@/components/ui/skeleton";

function WeatherSkeleton() {
  return (
   
     <div>
      <div className="sec-wrap flex justify-center" >
      <div className="skeleton-card flex flex-col justify-center rounded-lg p-4" style={{border: "2px solid skyblue", width: "350px", height: "230px"}}>
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
      </div>
      <div className='flex justify-center'>
      <div className='flex justify-center flex-col'>
        <h2 style={{textAlign: "center", marginTop: "40px"}}>Hourly</h2>
        <div style={{maxWidth: "700px"}} className="hourly-temp-wrap sm:flex flex-row flex-wrap justify-evenly col-span-3">
          {Array(24).fill().map((_, index) => (
            <Skeleton key={index} className="skeleton-hourly" style={{
              border: "2px solid skyblue",
              textAlign: "center",
              paddingTop: "24px",
              paddingBottom: "24px",
              paddingLeft: "33px",
              paddingRight: "30px",
              borderRadius: "4px",
              margin: "10px",
              width: "200px",
              height: "40px" // Assuming you want the skeleton to be approximately the same height as your content
            }} />
          ))}
        </div>
      </div>
    </div>
      </div>
  
  );
}


export default WeatherSkeleton