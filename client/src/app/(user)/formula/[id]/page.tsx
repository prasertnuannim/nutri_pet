import { getRequirement } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function RequirementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getRequirement(id)

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{item.requirement_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Badge variant="secondary">Species: {item.species}</Badge>
            <Badge variant="outline">Type: {item.type || '-'}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Requirement ID: {item.requirement_id}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nutrient Limits ({item.nutrient_limits?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Nutrient</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {item.nutrient_limits?.map((row) => (
                <TableRow key={row.limit_id}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.nutrient}</TableCell>
                  <TableCell>{row.min_value ?? '-'}</TableCell>
                  <TableCell>{row.max_value ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}