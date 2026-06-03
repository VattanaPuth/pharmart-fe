import { Suspense } from "react";
import RoleSelectionPageContent from "./RoleSelectionPageContent";

export default function RoleSelectionPage(){
  return(
    <Suspense fallback={<div>Loading Role Selection Page</div>}>
        <RoleSelectionPageContent/>
    </Suspense>
  )
}