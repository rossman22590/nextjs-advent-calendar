import { redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { authAction } from "./server-actions";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="max-w-md mx-auto w-full">
      <Card>
        <CardHeader className="text-xl font-semibold">Login</CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" action={authAction.bind(null, "login")}>
            <Input name="email" type="email" label="Email" required />
            <Input
              name="password"
              type="password"
              label="Password"
              required
            />
            <Button type="submit" color="primary">
              Sign in
            </Button>
          </form>
          <p className="text-sm mt-4">
            Need an account?{" "}
            <Link href="/register" className="text-primary">
              Register
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
