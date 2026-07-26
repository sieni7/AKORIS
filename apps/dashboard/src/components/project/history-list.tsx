import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface HistoryEntry {
  from?: string;
  to?: string;
  timestamp?: string;
  authorizedBy?: string;
}

interface HistoryListProps {
  history: HistoryEntry[];
}

export function HistoryList({ history }: HistoryListProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Transition History</CardTitle></CardHeader>
      <CardContent>
        {history.length === 0 && <p className="text-sm text-muted-foreground">No transitions recorded yet.</p>}
        {history.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-auto">
            {history.slice().reverse().map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.from ?? '—'}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{entry.to ?? '—'}</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  {entry.timestamp && <span className="text-xs">{new Date(entry.timestamp).toLocaleString()}</span>}
                  {entry.authorizedBy && <span className="text-xs bg-muted px-2 py-0.5 rounded">{entry.authorizedBy}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
