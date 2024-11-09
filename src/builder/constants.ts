const MEGABYTE = 1024 * 1024;

export const MAX_FILE_SIZE = MEGABYTE * 50; // Max file size in bytes

export const getApkDir = () => process.env.APK_DIR ?? "/apk/";

export const createApkFileName = (fileExtension: string) =>
	`Argo-${Date.now()}.${fileExtension}`;

export const GITHUB_EVENT_HEADER = "X-Github-Event";
