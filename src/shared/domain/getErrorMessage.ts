export function getErrorMessage(error: unknown, fallbackMessage: string): string {
    if (error instanceof Error && error.message.length > 0) {
        return error.message;
    }

    return fallbackMessage;
}
