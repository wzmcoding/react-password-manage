import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { toast } from "sonner"
import { register } from '@/api/user.ts'

import { useNavigate } from "react-router-dom";

// 1️⃣ 注册校验规则
const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, "用户名至少3位")
            .max(20, "用户名最多20位"),

        password: z
            .string()
            .min(6, "密码至少6位")
            .regex(/[A-Z]/, "至少包含一个大写字母")
            .regex(/[0-9]/, "至少包含一个数字"),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "两次密码不一致",
        path: ["confirmPassword"],
    })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            setLoading(true)
            const res = await register(values)
            if (res.code === 500) {
                throw new Error("注册失败")
            }
            toast.success("注册成功！", { position: "top-center" })
            navigate("/login")
        } catch (error) {
            toast.error(error.message, { position: "top-center" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <Card className="w-[420px] shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        创建账号
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

                            {/* 确认密码 */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>确认密码</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="请再次输入密码"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "注册中..." : "注册"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
