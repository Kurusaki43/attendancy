import { Info, Mail } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type EmployeeAccountInvitationCardProps = {
  email: string;
};

export function EmployeeAccountInvitationCard({ email }: EmployeeAccountInvitationCardProps) {
  return (
    <Card size="sm" className="opacity-70">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
          <Mail className="size-4" />
        </div>
        <CardTitle className="text-sm">Account &amp; Invitation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-primary/5 border-primary/20 flex items-start gap-2 rounded-md border p-2.5 text-xs">
          <Info className="text-primary mt-0.5 size-3.5 shrink-0" />
          <p className="text-muted-foreground">
            An invitation email will be sent to{' '}
            <strong className="text-foreground">{email || 'the employee'}</strong> with instructions
            to set up their account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
