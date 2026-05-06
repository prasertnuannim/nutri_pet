import Link from 'next/link'
import { getRequirements } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function RequirementsPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; species?: string }>
}) {
  const params = await searchParams
  const data = await getRequirements({
    keyword: params.keyword,
    species: params.species,
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Requirements</h1>
          <p className="text-sm text-muted-foreground">จัดการเกณฑ์อาหารสัตว์ทั้งหมด</p>
        </div>
        <Button asChild>
          <Link href="/requirements/new">เพิ่ม Requirement</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ค้นหา</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3">
            <Input name="keyword" placeholder="ค้นหาชื่อ requirement หรือ type" defaultValue={params.keyword} />
            <Input name="species" placeholder="species เช่น dog" defaultValue={params.species} />
            <Button type="submit">ค้นหา</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>รายการทั้งหมด ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Requirement Name</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.requirement_id}>
                  <TableCell>{item.requirement_id}</TableCell>
                  <TableCell>{item.type || '-'}</TableCell>
                  <TableCell>{item.species}</TableCell>
                  <TableCell>{item.requirement_name}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/requirements/${item.requirement_id}`}>ดูรายละเอียด</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}