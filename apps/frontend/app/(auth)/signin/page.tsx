"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SigninSchema } from "@repo/common/types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type signinFromValues = z.infer<typeof SigninSchema>;

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signinFromValues>({
    resolver: zodResolver(SigninSchema),
  });

  const onSubmit = (data: signinFromValues) => {
    console.log("Submitted data::", data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-screen justify-center items-center p-2"
      >
        <Card className="w-[450px] min-w-[300px]">
          <CardHeader>
            <CardTitle>Signin</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Username</Label>
                  <Input
                    id="email"
                    placeholder="example@gmail.com"
                    type="email"
                    
                    {...register("username")}
                  />
                   {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="*********"
                    
                    {...register("password")}
                  />
                   {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Sign in</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default Signin;
