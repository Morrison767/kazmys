import { Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button, EmptyState } from "@/components/ui";
import { ROLE_META } from "@/config/roles";
import { useSessionStore } from "@/store";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const role = useSessionStore((s) => s.role);
  const home = ROLE_META[role];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Страница не найдена"
        description="Такого раздела нет либо он недоступен текущей роли."
      />
      <EmptyState
        icon={Compass}
        title="Раздел недоступен"
        description={`В роли «${home.label}» доступны свои разделы — перейдите на стартовый экран роли или смените роль в шапке.`}
        action={
          <Button onClick={() => navigate(home.homePath)}>
            На стартовый экран роли
          </Button>
        }
      />
    </div>
  );
}
