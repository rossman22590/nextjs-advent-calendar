"use client";

import { faCandyCane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  code: string;
};

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) =>
    router.push(`/c/${data.code}`); // TODO some mapping...

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-lg w-full">
        <div className="flex flex-col gap-5 bg-[#0a0015] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] p-10 border border-purple-500/30">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col gap-6 items-center justify-center">
              <div className="p-6">
                <FontAwesomeIcon
                  icon={faCandyCane}
                  className="h-20 w-20 text-pink-400"
                />
              </div>
              <p className="text-lg text-white text-center">Please enter the code to open your advent calendar.</p>
              <p className="text-sm text-gray-400 text-center italic">Hint: Acronym of &quot;Tech In Schools Initiative&quot; in all caps</p>
              <div className="flex w-full gap-4">
                <Input
                  size="lg"
                  type="text"
                  placeholder="Code"
                  variant="bordered"
                  className="w-full"
                  classNames={{
                    input: "text-white placeholder:text-gray-400",
                    label: "!text-pink-300 group-data-[filled=true]:!text-pink-300",
                    inputWrapper: "bg-white/10 border-2 border-white/30 hover:border-white/50 focus-within:border-pink-400 data-[hover=true]:bg-white/10"
                  }}
                  style={{ color: 'white' } as any}
                  {...register("code", { required: true })}
                />
              </div>
              <Button size="lg" type="submit" color="primary" className="w-full font-bold text-xl">
                Enter
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
