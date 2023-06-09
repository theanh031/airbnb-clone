"use client";
import {signIn} from "next-auth/react"
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useRegisterModal from "../hooks/useRegisterModal";
import { useCallback, useState } from "react";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../Input/Input";
import Button from "../Button";
import useLoginModal from "../hooks/useLoginModal";
import { useRouter } from "next/navigation";

const LoginModal = () => {
    const router = useRouter()
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) => {
            setIsLoading(false);

            if(callback?.ok) {
                toast.success('Login successful')
                router.refresh();
                loginModal.onClose();
            }
            if(callback?.error) {
                toast.error(callback.error)

            }
        })

    };

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen()
    }, [loginModal, registerModal])
    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to Airbnb" />
            <Input
                id="email"
                type="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                onClick={() => signIn('google')}
                outline
                label="Continue with Google"
                icon={FcGoogle}
            />
            <Button
                onClick={() => signIn('github')}
                outline
                label="Continue with Github"
                icon={AiFillGithub}
            />
            <div
                className="
                    text-neutral-500
                    mt-4
                    font-light
                "
            >
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>First Time using Airbnb?</div>
                    <div
                        onClick={toggle}
                        className="
                            text-neutral-800
                            cursor-pointer
                            hover:underline
                        
                        "
                    >
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default LoginModal;
