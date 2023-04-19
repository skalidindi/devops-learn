import { ecr } from "@pulumi/aws";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

type FmDockerImageArgs = {
  name: string;
  product: string;
};

export class FmDockerImageRepo extends ComponentResource {
  constructor(args: FmDockerImageArgs, opts?: ComponentResourceOptions) {
    const { name, product } = args;
    const resourceName = `${product}-${name}`;

    super("pkg:index:FmDockerImageRepo", resourceName, {}, opts);

    new ecr.Repository(
      name,
      {
        name: resourceName,
        imageScanningConfiguration: {
          scanOnPush: true,
        },
        imageTagMutability: "MUTABLE",
      },
      {
        parent: this,
      }
    );
  }
}
