import styles from './ImplantIcon.module.css';
import { THUMBS } from './thumbs';

import { type ImplantName, useImplantStatus } from '@/feature/implant';
import { UiImage } from '@/ui';

interface Props {
  implant: ImplantName;
}

export const ImplantIcon = ({ implant }: Props) => {
  const status = useImplantStatus(implant);
  const src = THUMBS[implant];

  return (
    <UiImage
      src={src}
      alt={implant}
      size={100}
      wrapperClassName={[
        styles.img,
        styles.wrapper,
        status ? styles[status] : '',
      ]
        .filter(Boolean)
        .join(' ')}
      radius={8}
      fit="contain"
    />
  );
};
