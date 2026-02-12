import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { login } from '@/api/user.ts'
import { useNavigate } from "react-router-dom";

// 1️⃣ 定义表单校验规则
const loginSchema = z.object({
    username: z.string().min(3, "用户名至少3位"),
    password: z.string().min(6, "密码至少6位"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // 2️⃣ 提交逻辑
    const onSubmit = async (values: LoginFormValues) => {
        try {
            setLoading(true)
            const res = await login(values)
            if (res.code === 500) {
                throw new Error(res.message)
            }
            const token = res.data
            localStorage.setItem("accessToken", token)
            toast.success("登录成功！", { position: "top-center" })
            navigate("/")
        } catch (error) {
            toast(error.message, { position: "top-center" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <Card className="w-[380px] shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        PasswordManage
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* 用户名 */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>用户名</FormLabel>
                                        <FormControl>
                                            <Input placeholder="请输入用户名" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 密码 */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>密码</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="请输入密码"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 登录按钮 */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "登录中..." : "登录"}
                            </Button>
                            <Link to="/register" className="text-sm text-blue-500">
                                没有账号？去注册
                            </Link>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
