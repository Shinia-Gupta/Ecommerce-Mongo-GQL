import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonCard() {
  return (
    <div
      className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md h-96"
    >
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <Skeleton className="object-contain w-full h-full" />
      </div>
      <div className="mt-4 px-5 pb-5 flex flex-col flex-grow">
        <div>
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <Skeleton className="h-6 w-1/4" />
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-5 w-5 text-yellow-300 mr-1" />
            ))}
            <Skeleton className="mr-2 ml-3 rounded px-2.5 py-0.5 text-xs font-semibold h-5 w-8" />
          </div>
        </div>
        <div className="mt-auto">
          <Skeleton className="flex items-center justify-center rounded-md px-5 py-2.5 text-center text-sm font-medium text-white h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
