import {
  ComponentResource,
  ComponentResourceOptions,
  getStack,
} from "@pulumi/pulumi";
import { s3 } from "@pulumi/aws";

type FmBucketArgs = {
  name: string;
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

    let bucketArgs: s3.BucketArgs = {
      acl: "private",
      bucket: bucketName,
      tags: {
        Environment: stack,
      },
    };

    if (isPublic) {
      bucketArgs = {
        ...bucketArgs,
        acl: "public-read",
        website: {
          indexDocument: "index.html",
          errorDocument: "error.html",
          routingRules: `[{
            "Condition": {
              "KeyPrefixEquals": "docs/"
            },
            "Redirect": {
              "ReplaceKeyPrefixWith": "docs/latest/"
            }
          }]`,
        },
      };
    }

    const bucket = new s3.Bucket(args.name, bucketArgs, { parent: this });

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
