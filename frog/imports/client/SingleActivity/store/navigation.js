// @flow

export const goToHomepage = ({ push }: { push: (path: string) => void }) => {
  push('/');
};

export const goToTemplateSelect = ({
  push
}: {
  push: (path: string) => void
}) => {
  push('/wizard');
};

export const goToTemplateConfig = (
  { push }: { push: (path: string) => void },
  templateId: string
) => {
  push(`/wizard/${templateId}`);
};

export const getTemplateId = (path: string) => {
  return path.split('/')[2];
};

export const goToOrchestration = (
  { push }: { push: (path: string) => void },
  slug: string
) => {
  push(`/t/${slug}`);
};
