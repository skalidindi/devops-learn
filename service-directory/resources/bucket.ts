import {
  ComponentResource,
  ComponentResourceOptions,
  getStack,
} from "@pulumi/pulumi";
import { s3 } from "@pulumi/aws";

type FmBucketArgs = {
  name: string;
  environment: string;
  product: string;
  public?: boolean;
};

function generateBucketName(name: string, product: string) {
  return `${product}-${name}`;
}

export class FmBucket extends ComponentResource {
  constructor(args: FmBucketArgs, opts?: ComponentResourceOptions) {
    const isPublic = args.public ?? false;
    const resourceName = generateBucketName(args.name, args.product);
    super("pkg:index:FmBucket", resourceName, {}, opts);

    const stack = getStack();
    const bucketName = `${resourceName}-${stack}`;

    const bucket = new s3.Bucket(
      args.name,
      {
        acl: "private",
        bucket: bucketName,
        tags: {
          Environment: "Dev",
        },
      },
      { parent: this }
    );

    if (isPublic) {
      new s3.BucketPublicAccessBlock(
        args.name,
        {
          bucket: bucket.id,
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true,
        },
        {
          parent: this,
        }
      );
    }
  }
}
