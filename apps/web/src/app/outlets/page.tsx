import OutletLocation from "@/components/(outlets)/OutletList"

const page = () => {
  return (
    <section className="bg-beigeCustom w-full min-h-screen flex flex-col justify-center items-center md:py-10">
      <h1 className="text-3xl md:text-6xl font-semibold uppercase tracking-wide text-black mb-0 mt-12 md:mb-3 md:mt-0 text-center w-full">Outlets Locations</h1>
      <OutletLocation/>
    </section>
  )
}

export default page