import { useQuery } from '@tanstack/react-query';
import { useAKORIS } from '../../lib/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export function QualityModule() {
  const { client, withNotifications } = useAKORIS();

  const diagnosis = useQuery({
    queryKey: ['doctor'],
    queryFn: () => client.diagnose(),
  });

  const safeFix = withNotifications(
    (issueIds?: string[]) => client.fix(issueIds),
    { successMessage: 'Fix applied successfully', errorMessage: 'Fix failed. Check the logs.' },
  );

  const handleFix = async (issueIds?: string[]) => {
    await safeFix(issueIds);
    diagnosis.refetch();
  };

  const severityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': case 'high': return 'destructive';
      case 'medium': case 'warning': return 'warning';
      case 'low': case 'info': return 'secondary';
      default: return 'default';
    }
  };

  if (diagnosis.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const issues: any[] = diagnosis.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">System Quality</h2>
        <Button variant="outline" size="sm" onClick={() => handleFix()} disabled={issues.length === 0}>Fix All</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Critical</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-destructive">
            {issues.filter((i: any) => i.severity === 'critical' || i.severity === 'high').length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Warnings</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {issues.filter((i: any) => i.severity === 'medium' || i.severity === 'warning').length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Info</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold text-muted-foreground">
            {issues.filter((i: any) => i.severity === 'low' || i.severity === 'info').length}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Issues ({issues.length})</CardTitle></CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">No issues found. System is healthy.</p>
          ) : (
            <div className="space-y-2">
              {issues.map((issue: any, idx: number) => (
                <div key={issue.id ?? idx} className="flex items-start justify-between rounded-md border p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={severityColor(issue.severity) as any}>{issue.severity ?? 'unknown'}</Badge>
                      <span className="font-medium text-sm">{issue.title ?? issue.message ?? 'Issue'}</span>
                    </div>
                    {issue.message && issue.title && <p className="mt-1 text-xs text-muted-foreground">{issue.message}</p>}
                    {issue.agent && <p className="mt-1 text-xs text-muted-foreground">Agent: {issue.agent}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleFix(issue.id ? [issue.id] : undefined)}>Fix</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
