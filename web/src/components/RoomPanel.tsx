import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FC, Fragment, useEffect, useState,
} from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import api from '../lib/api';
import { ErrorMessagesAlert } from './ErrorMessagesAlert';
import { InputBlock } from './InputBlock';
import { SubmitButton } from './LoadingButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void
}

interface FormValues {
  name: string;
  description: string;
}

interface CreateRoomResponse {
  name: string
}

const formSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
});

export const RoomPanel: FC<Props> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const form = useForm<FormValues>({ resolver: yupResolver(formSchema) });
  const [errorMessages, setErrorMessages] = useState([]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const { name } = await api.post<CreateRoomResponse>('/rooms', data)
        .then((response) => response.data);

      onClose();
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (e) {
      setErrorMessages(e.response?.data?.message || []);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      form.clearErrors();
      form.reset();
      setErrorMessages([]);
    }, 1000);
  }, [isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" static className="fixed z-20 inset-0 overflow-hidden" open={isOpen} onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
                    <div className="flex-1 h-0 overflow-y-auto">
                      <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            New Room
                          </Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Get started by filling in the information below to create your new room.
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="px-4 divide-y divide-gray-200 sm:px-6">
                          <div className="space-y-6 pt-6 pb-5">
                            <ErrorMessagesAlert messages={errorMessages} />

                            <InputBlock labelText="Name" type="text" name="name" />
                            <InputBlock labelText="Description" type="text" name="description" />

                            <fieldset>
                              <legend className="text-sm font-medium text-gray-900">Privacy</legend>
                              <div className="mt-2 space-y-5">
                                <div className="relative flex items-start">
                                  <div className="absolute flex items-center h-5">
                                    <input
                                      id="privacy_public"
                                      name="privacy"
                                      aria-describedby="privacy_public_description"
                                      type="radio"
                                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                      defaultChecked
                                    />
                                  </div>
                                  <div className="pl-7 text-sm">
                                    <label htmlFor="privacy_public" className="font-medium text-gray-900">
                                      Public
                                    </label>
                                    <p id="privacy_public_description" className="text-gray-500">
                                      Everyone will be able to see this room
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex items-center h-5">
                                      <input
                                        id="privacy_private-to-project"
                                        name="privacy"
                                        aria-describedby="privacy_private-to-project_description"
                                        type="radio"
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                      />
                                    </div>
                                    <div className="pl-7 text-sm">
                                      <label htmlFor="privacy_private-to-project" className="font-medium text-gray-900">
                                        Private
                                      </label>
                                      <p id="privacy_private-to-project_description" className="text-gray-500">
                                        Only people you invite can see this room
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <div className="ml-3">
                        <SubmitButton isLoading={form.formState.isSubmitting} text="Save" loadingText="Saving" />
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};