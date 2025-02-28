import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {}

const Signup = (props: Props) => {
  return (
    <div className="flex h-screen justify-center items-center p-2">
         <Card className="w-[450px] min-w-[300px]">
      <CardHeader>
        <CardTitle>Signup Now!</CardTitle>
        <CardDescription>Get started by creating an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="example@gmail.com" />
            </div>
            <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Password</Label>
            <Input type="password" id="password" placeholder="*********" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>Sign up</Button>
      </CardFooter>
    </Card>
    </div>
  )
}

export default Signup