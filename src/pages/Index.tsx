import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { list, add } from "@/api/account"
import type { Account } from "@/types/account"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { toast } from "sonner"

/* 1️⃣ 表单校验规则 */
const accountSchema = z.object({
    title: z.string().min(1, "标题不能为空"),
    account: z.string().min(1, "账号不能为空"),
    password: z.string().min(1, "密码不能为空"),
    note: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountSchema>

export default function Index() {
    const [data, setData] = useState<Account[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            title: "",
            account: "",
            password: "",
            note: "",
        },
    })

    /* 获取列表 */
    const fetchData = async () => {
        try {
            const res = await list()
            setData(res.data)
        } catch (e: Error) {
            toast.error(e.message || "获取数据失败")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    /* 提交 */
    const onSubmit = async (values: AccountFormValues) => {
        try {
            setLoading(true)
            await add(values)
            toast.success("新增成功")

            form.reset()
            setOpen(false)
            fetchData()
        } catch (e: Error) {
            toast.error(e.message || "新增失败")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">账号列表</h2>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>新增账号</Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>新增账号</DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>标题</FormLabel>
                                            <FormControl>
                                                <Input placeholder="请输入标题" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="account"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>账号</FormLabel>
                                            <FormControl>
                                                <Input placeholder="请输入账号" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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

                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>备注</FormLabel>
                                            <FormControl>
                                                <Input placeholder="备注信息" {...field} />
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
                                    {loading ? "提交中..." : "提交"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableCaption>你的账号数据</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>标题</TableHead>
                        <TableHead>账号</TableHead>
                        <TableHead>密码</TableHead>
                        <TableHead>备注</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.account}</TableCell>
                            <TableCell>{item.password}</TableCell>
                            <TableCell>{item.note}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
