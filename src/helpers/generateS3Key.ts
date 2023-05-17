export const generateS3Key = (url: string) => {
    const key = url.split('?')[0].split('https://photo-drop-lambda.s3.eu-central-1.amazonaws.com/')[1]
    return key
}
