import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";
import { FmDockerImageRepo } from "../resources/ecr-repository";

type FmBackendArgs = {
  name: string;
  product: string;
};

export class FmBackend extends ComponentResource {
  constructor(args: FmBackendArgs, opts?: ComponentResourceOptions) {
    const { name, product } = args;
    const resourceName = `${product}-${name}`;

    super("pkg:index:FmBackend", resourceName, args, opts);

    new FmDockerImageRepo(
      {
        name,
        product,
      },
      { parent: this }
    );
  }
}
