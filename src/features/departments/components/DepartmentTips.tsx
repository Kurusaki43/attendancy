import { CircleCheck, Lightbulb } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TIPS = [
  {
    title: 'Use a clear and concise name',
    description: 'Make it easy to understand for everyone',
  },
  { title: 'Choose a unique code', description: 'Use short codes for easy reference' },
  {
    title: 'Pick a memorable icon and color',
    description: 'Helps the department stand out at a glance',
  },
  {
    title: 'Organize with parent departments',
    description: 'Use sub-departments for better structure',
  },
];

export function DepartmentTips() {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Lightbulb className="size-4 text-amber-500" />
        <CardTitle>Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {TIPS.map((tip) => (
          <div key={tip.title} className="flex items-start gap-2">
            <CircleCheck className="text-primary mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">{tip.title}</p>
              <p className="text-muted-foreground text-xs">{tip.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
