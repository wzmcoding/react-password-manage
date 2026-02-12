import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { list, add, update, del } from "@/api/account"
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

/* 表单校验 */
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

    const [mode, setMode] = useState<"add" | "edit">("add")
    const [currentId, setCurrentId] = useState<number | null>(null)

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
            toast.error(e.message || "获取数据失败", { position: "top-center" })
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    /* 打开新增 */
    const handleAddOpen = () => {
        setMode("add")
        setCurrentId(null)
        form.reset({
            title: "",
            account: "",
            password: "",
            note: "",
        })
        setOpen(true)
    }

    /* 打开编辑 */
    const handleEdit = (item: Account) => {
        setMode("edit")
        setCurrentId(item.id)

        form.reset({
            title: item.title,
            account: item.account,
            password: item.password,
            note: item.note,
        })

        setOpen(true)
    }

    /* 删除 */
    const handleDelete = async (id: number) => {
        try {
            await del(id)
            toast.success("删除成功", { position: "top-center" })
            fetchData()
        } catch (e: Error) {
            toast.error(e.message || "删除失败", { position: "top-center" })
        }
    }

    /* 提交（新增 or 编辑） */
    const onSubmit = async (values: AccountFormValues) => {
        try {
            setLoading(true)

            if (mode === "add") {
                await add(values)
                toast.success("新增成功", { position: "top-center" })
            } else {
                await update({
                    id: currentId!,
                    ...values,
                })
                toast.success("更新成功", { position: "top-center" })
            }

            form.reset()
            setOpen(false)
            fetchData()
        } catch (e: Error) {
            toast.error(e.message || "操作失败")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">账号列表</h2>

                <Button onClick={handleAddOpen}>
                    新增账号
                </Button>
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
                        <TableHead>操作</TableHead>
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
                            <TableCell className="space-x-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                >
                                    编辑
                                </Button>

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    删除
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* 弹窗 */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "add" ? "新增账号" : "编辑账号"}
                        </DialogTitle>
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
                                {loading
                                    ? "提交中..."
                                    : mode === "add"
                                        ? "新增"
                                        : "更新"}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
