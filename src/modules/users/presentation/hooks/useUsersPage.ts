'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { sortUsersByNewest, type User } from '@modules/users/domain/User';
import { userFormSchema, type UserFormValues } from '@modules/users/presentation/forms/UserFormSchema';
import type { UsersPageProps } from '@modules/users/presentation/UsersPresentationContracts';
import { type BaseSyntheticEvent, useState } from 'react';
import { type SubmitHandler, useForm, type UseFormRegisterReturn } from 'react-hook-form';

export interface UsersPageViewModel {
    confirmingDeleteUserId?: string | undefined;
    deletingUserId?: string | undefined;
    deleteErrorMessage?: string | undefined;
    editingUserId?: string | undefined;
    editorTitle?: string | undefined;
    emailError?: string | undefined;
    emailField: UseFormRegisterReturn;
    isEditorOpen: boolean;
    isDeleting: boolean;
    isSubmitting: boolean;
    loadErrorMessage?: string | undefined;
    nameError?: string | undefined;
    nameField: UseFormRegisterReturn;
    onCancelDelete: () => void;
    onCancelEdit: () => void;
    onDelete: (user: User) => Promise<void>;
    onEdit: (user: User) => void;
    onOpenCreate: () => void;
    onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
    recordsLabel: string;
    submitButtonLabel?: string | undefined;
    submitErrorMessage?: string | undefined;
    users: User[];
}

export function useUsersPage(props: UsersPageProps): UsersPageViewModel {
    const [confirmingDeleteUserId, setConfirmingDeleteUserId] = useState<string>();
    const [deleteErrorMessage, setDeleteErrorMessage] = useState<string>();
    const [deletingUserId, setDeletingUserId] = useState<string>();
    const [editingUserId, setEditingUserId] = useState<string>();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState<string>();
    const [users, setUsers] = useState<User[]>(props.initialUsers);
    const form = useForm<UserFormValues>({ defaultValues: { email: '', name: '' }, resolver: zodResolver(userFormSchema) });

    const resetEditor = (): void => {
        setEditingUserId(undefined);
        setIsEditorOpen(false);
        form.reset({ email: '', name: '' });
    };

    const resetDeleteConfirmation = (): void => {
        setConfirmingDeleteUserId(undefined);
    };

    const resetMutationMessages = (): void => {
        setDeleteErrorMessage(undefined);
        setSubmitErrorMessage(undefined);
    };

    const handleOpenCreate = (): void => {
        resetMutationMessages();
        resetDeleteConfirmation();
        setEditingUserId(undefined);
        setIsEditorOpen(true);
        form.reset({ email: '', name: '' });
        queueMicrotask((): void => form.setFocus('name'));
    };

    const submit: SubmitHandler<UserFormValues> = async (values: UserFormValues): Promise<void> => {
        setIsSubmitting(true);

        try {
            if (editingUserId === undefined) {
                const result = await props.actions.createUser(values);

                if (!result.ok) {
                    setSubmitErrorMessage(result.errorMessage);
                    return;
                }

                setUsers((currentUsers: User[]) => sortUsersByNewest([result.user, ...currentUsers]));
            } else {
                const result = await props.actions.updateUser({ ...values, id: editingUserId });

                if (!result.ok) {
                    setSubmitErrorMessage(result.errorMessage);
                    return;
                }

                setUsers((currentUsers: User[]) =>
                    sortUsersByNewest(currentUsers.map((user: User) => (user.id === result.user.id ? result.user : user)))
                );
            }

            resetEditor();
            resetMutationMessages();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (user: User): void => {
        resetMutationMessages();
        resetDeleteConfirmation();
        setEditingUserId(user.id);
        setIsEditorOpen(true);
        form.reset({ email: user.email, name: user.name });
        queueMicrotask((): void => form.setFocus('name'));
    };

    const handleCancelEdit = (): void => {
        resetMutationMessages();
        resetEditor();
    };

    const handleDelete = async (user: User): Promise<void> => {
        if (confirmingDeleteUserId !== user.id) {
            setDeleteErrorMessage(undefined);
            setConfirmingDeleteUserId(user.id);
            return;
        }

        setDeletingUserId(user.id);
        setIsDeleting(true);
        try {
            const result = await props.actions.deleteUser({ id: user.id });

            if (!result.ok) {
                setDeleteErrorMessage(result.errorMessage);
                resetDeleteConfirmation();
                return;
            }

            setUsers((currentUsers: User[]) => currentUsers.filter((currentUser: User) => currentUser.id !== result.deletedUserId));
            resetDeleteConfirmation();
            if (editingUserId === user.id) {
                resetEditor();
            }
        } finally {
            setDeletingUserId(undefined);
            setIsDeleting(false);
        }
    };

    const recordsLabel: string = `${users.length} ${users.length === 1 ? 'record' : 'records'}`;

    return {
        confirmingDeleteUserId,
        deletingUserId,
        deleteErrorMessage,
        editingUserId,
        editorTitle: isEditorOpen ? (editingUserId === undefined ? 'New user' : 'Edit user') : undefined,
        emailError: form.formState.errors.email?.message,
        emailField: form.register('email'),
        isDeleting,
        isEditorOpen,
        isSubmitting,
        loadErrorMessage: props.loadErrorMessage,
        nameError: form.formState.errors.name?.message,
        nameField: form.register('name'),
        onCancelDelete: resetDeleteConfirmation,
        onCancelEdit: handleCancelEdit,
        onDelete: handleDelete,
        onEdit: handleEdit,
        onOpenCreate: handleOpenCreate,
        onSubmit: form.handleSubmit(submit),
        recordsLabel,
        submitButtonLabel: isEditorOpen
            ? (editingUserId === undefined ? (isSubmitting ? 'Creating...' : 'Create user') : (isSubmitting ? 'Saving...' : 'Save changes'))
            : undefined,
        submitErrorMessage,
        users
    };
}
