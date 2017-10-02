// @flow

var minioClient = new Minio.Client({
  endPoint: '165.227.168.213',
  port: 9000,
  secure: false,
  accessKey: 'AKIAIOSFODNN7EXAMPLE',
  secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
});

export const uploadFile = (files: Array<any>, callback: string => any) => {};
