'use server';

import { getUsersModule } from '@composition/server/users/getUsersModule';
import { userFormSchema } from '@modules/users/presentation/forms/UserFormSchema';
import type { DeleteUserResult, UserMutationResult } from '@modules/users/presentation/UsersPresentationContracts';
import { getErrorMessage } from '@shared/domain/getErrorMessage';
import { z } from 'zod';

const userIdSchema = z.object({ id: z.string().uuid('Use a valid user id.') });
const updateUserSchema = userFormSchema.extend({ id: z.string().uuid('Use a valid user id.') });

function getValidationMessage(error: z.ZodError): string {
    const issue: z.core.$ZodIssue | undefined = error.issues[0];

    return issue?.message ?? 'The submitted payload is invalid.';
}

export async function createUserAction(input: unknown): Promise<UserMutationResult> {
    const parsedInput = userFormSchema.safeParse(input);

    if (!parsedInput.success) {
        return { errorMessage: getValidationMessage(parsedInput.error), ok: false };
    }

    try {
        const user = await getUsersModule().useCases.createUser.execute(parsedInput.data);

        return { ok: true, user };
    } catch (error) {
        return { errorMessage: getErrorMessage(error, 'Could not create the user.'), ok: false };
    }
}

export async function updateUserAction(input: unknown): Promise<UserMutationResult> {
    const parsedInput = updateUserSchema.safeParse(input);

    if (!parsedInput.success) {
        return { errorMessage: getValidationMessage(parsedInput.error), ok: false };
    }

    try {
        const user = await getUsersModule().useCases.updateUser.execute(parsedInput.data);

        return { ok: true, user };
    } catch (error) {
        return { errorMessage: getErrorMessage(error, 'Could not update the user.'), ok: false };
    }
}

export async function deleteUserAction(input: unknown): Promise<DeleteUserResult> {
    const parsedInput = userIdSchema.safeParse(input);

    if (!parsedInput.success) {
        return { errorMessage: getValidationMessage(parsedInput.error), ok: false };
    }

    try {
        await getUsersModule().useCases.deleteUser.execute(parsedInput.data.id);

        return { deletedUserId: parsedInput.data.id, ok: true };
    } catch (error) {
        return { errorMessage: getErrorMessage(error, 'Could not delete the user.'), ok: false };
    }
}
