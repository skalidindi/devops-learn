// import { FmBucket } from "./resources/bucket";
import { FmFrontend } from "./services/frontend";

function main() {
  // const buckets: { name: string; product: string }[] = [
  //   {
  //     name: "my-bucket",
  //     product: "my-product",
  //   },
  //   {
  //     name: "santosh-bucket",
  //     product: "acme-product",
  //   },
  // ];

  // for (const bucket of buckets) {
  //   new FmBucket({
  //     name: bucket.name,
  //     environment: "dev",
  //     product: bucket.product,
  //   });
  // }

  new FmFrontend({
    name: "frontend",
    product: "acme-product",
  });
}

main();
