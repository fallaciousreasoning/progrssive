import LoadingSpinner from "@/components/LoadingSpinner";
import React, { Suspense } from "react";

const Stream = React.lazy(() => import('components/Stream'))

export default function () {
  return <Suspense fallback={<div className="w-full flex justify-center">
    <LoadingSpinner />
  </div>}>
    <Stream />
  </Suspense>
};
