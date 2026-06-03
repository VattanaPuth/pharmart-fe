import { Suspense} from "react";
import PharmaciesPageContent from "./StoresPageContent";

export default function PharmaciesPage(){
  return(
    <Suspense fallback={<div>Loading Pharmacies</div>}>
      <PharmaciesPageContent/>
    </Suspense>
  )
}