import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";
import { FmBucket } from "../resources/bucket";

type FmFrontendArgs = {
  name: string;
  product: string;
};

export class FmFrontend extends ComponentResource {
  constructor(args: FmFrontendArgs, opts?: ComponentResourceOptions) {
    const { name, product } = args;
    const resourceName = `${product}-${name}`;

    super("pkg:index:FmFrontend", resourceName, args, opts);

    new FmBucket(
      {
        name,
        environment: "dev",
        product,
        public: true,
      },
      { parent: this }
    );

    new FmBucket(
      {
        name: `${name}-replica`,
        environment: "dev",
        product,
      },
      { parent: this }
    );
  }
}
