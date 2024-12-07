import ImageKit from "@/components/imagekit";

export default function Posts() {
  return (
    <div className="grid md:grid-cols-4 grid-cols-2 grid-rows-2 gap-4 mt-4">
      <div className="w-full h-full rounded-md col-span-2 md:row-span-2">
        <div className="relative h-full w-full rounded-md">
          <ImageKit
            className="object-fill"
            path={"A6-600x375.png"}
            alt="image"
            loading="lazy"
          />
        </div>
      </div>
      <div className="w-full h-40 rounded-md col-span-2">
        <div className="relative h-full w-full rounded-md">
          <ImageKit
            className="object-fill"
            path={"86f7fda4f001285f711044-533x400.jpg"}
            alt="image"
            loading="lazy"
          />
        </div>
      </div>
      <div className="w-full h-40 rounded-md ">
        <div className="relative h-full w-full rounded-md">
          <ImageKit
            className="object-fill"
            path={"z4880862907385_93422f6b6ed268927b22ca04693cd072-300x400.jpg"}
            alt="image"
            loading="lazy"
          />
        </div>
      </div>
      <div className="w-full h-40 rounded-md ">
        <div className="relative h-full w-full rounded-md">
          <ImageKit
            className="object-fill"
            path={"z4882860658429_4ccd5d351b120effc88be28570c2b128-533x400.jpg"}
            alt="image"
            loading="lazy"
          />
        </div>
      </div>
      <div className="relative h-full w-full rounded-md">
        <ImageKit
          className="object-fill"
          path={"z4882860658429_4ccd5d351b120effc88be28570c2b128-533x400.jpg"}
          alt="image"
          loading="lazy"
        />
      </div>
    </div>
  );
}
