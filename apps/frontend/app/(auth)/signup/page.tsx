"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateUserSchema } from "@repo/common";

type signupFormSchema = z.infer<typeof CreateUserSchema>;

const Signup = () => {

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = async(data: signupFormSchema)=>{
    try{
      const response = await axios.post(`http://localhost:3002/signup`, data)
      localStorage.setItem("accessToken", response.data?.token)
      toast.success("Signed in successfully!" )
      router.push('/chat')
    }catch(error){
      console.log("Error while submitting the form::", error)
      toast.error("Error while submitting the form")
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-screen justify-center items-center p-2">
      <Card className="w-[450px] min-w-[300px]">
        <CardHeader>
          <CardTitle>Signup Now!</CardTitle>
          <CardDescription>Get started by creating an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe"  {...register("name")}/>
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="example@gmail.com" {...register("username")}/>
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Password</Label>
                <Input type="password" id="password" placeholder="*********" {...register("password")}/>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">Sign up</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default Signup;
