
import AllGalleriesDisplay from "@/components/all-gallery-display";

export const revalidate = 3600
const Page = async () => {

  return (
    <div className="mx-auto max-w-4xl p-6 text-lg">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Galleries Of Pictures</h1>

      <AllGalleriesDisplay />

    </div>
  )
}

export default Page