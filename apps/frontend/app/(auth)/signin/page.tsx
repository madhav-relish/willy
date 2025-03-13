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
import { SigninSchema } from "@repo/common";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";

type signinFromValues = z.infer<typeof SigninSchema>;

const Signin = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signinFromValues>({
    resolver: zodResolver(SigninSchema),
  });

  const onSubmit = async(data: signinFromValues) => {
    try{
      const response = await axios.post(`http://localhost:3002/signin`, data)
      // localStorage.setItem("accessToken", response.data?.token)
      setCookie('authToken2', response.data.token , {
        maxAge: 30*30*60*24
      })
      toast.success("Signed in successfully!" )
      router.push('/chat')
    }catch(error){
      console.log("Error while submitting the form::", error)
      toast.error("Error while submitting the form")
    }
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
