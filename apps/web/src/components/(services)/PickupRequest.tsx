"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const PickupRequest = () => {
  const params = useParams()
  const [serviceType, setServiceType] = useState("")

  useEffect(() => {
    if (params.type[0] === "wash-only") return setServiceType("Wash Only Package")
    if (params.type[0] === "iron-only") return setServiceType("Iron Only Package")
    if (params.type[0] === "complete-care") return setServiceType("Complete Care Package")
  },[params.service])
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <h1>{serviceType}</h1>
    </div>
  )
}

export default PickupRequest