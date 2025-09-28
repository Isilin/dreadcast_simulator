import { useMemo, useState } from 'react';

import styles from './implant-icon.module.css';

import aideDeCampIcon from '@/assets/implant/aide de camp.png';
import bruteIcon from '@/assets/implant/brute.png';
import chameauIcon from '@/assets/implant/chameau.png';
import chanceuxIcon from '@/assets/implant/chanceux.png';
import commandoIcon from '@/assets/implant/commando.png';
import enragéIcon from '@/assets/implant/enragé.png';
import flashGordonIcon from '@/assets/implant/flash gordon.png';
import félinIcon from '@/assets/implant/félin.png';
import geekIcon from '@/assets/implant/geek.png';
import génieIcon from '@/assets/implant/génie.png';
import ingénieurIcon from '@/assets/implant/ingénieur.png';
import inépuisableIcon from '@/assets/implant/inépuisable.png';
import jeTeVoisIcon from '@/assets/implant/je te vois.png';
import laMainBleueIcon from '@/assets/implant/la main bleue.png';
import monsieurCloneIcon from '@/assets/implant/monsieur clone.png';
import ninjaIcon from '@/assets/implant/ninja.png';
import oeilDeLynxIcon from '@/assets/implant/oeil de lynx.png';
import peauDacierIcon from "@/assets/implant/peau d'acier.png";
import peauDargentIcon from "@/assets/implant/peau d'argent.png";
import polyvalentIcon from '@/assets/implant/polyvalent.png';
import prestidigitateurIcon from '@/assets/implant/prestidigitateur.png';
import racisteIcon from '@/assets/implant/raciste.png';
import réplicateurIcon from '@/assets/implant/réplicateur.png';
import rôdeurIcon from '@/assets/implant/rôdeur.png';
import sainEtSaufIcon from '@/assets/implant/sain et sauf.png';
import scientifiqueIcon from '@/assets/implant/scientifique.png';
import tireurDéliteIcon from "@/assets/implant/tireur d'élite.png";
import urgentisteIcon from '@/assets/implant/urgentiste.png';
import éclaireurIcon from '@/assets/implant/éclaireur.png';
import économeIcon from '@/assets/implant/économe.png';
import type { ImplantName } from '@/domain';
import { Spinner } from '@/ui/spinner';

interface Props {
  implant: ImplantName;
  state?: 'DEFAULT' | 'ACTIVE';
}

export const ImplantIcon = ({ implant, state = 'DEFAULT' }: Props) => {
  const [loaded, setLoaded] = useState(false);

  const thumb = useMemo(() => {
    switch (implant) {
      case 'Génie':
        return génieIcon;
      case 'Réplicateur':
        return réplicateurIcon;
      case 'Sain et sauf':
        return sainEtSaufIcon;
      case 'Chameau':
        return chameauIcon;
      case 'Monsieur Clone':
        return monsieurCloneIcon;
      case 'Chanceux':
        return chanceuxIcon;
      case 'La Main Bleue':
        return laMainBleueIcon;
      case 'Économe':
        return économeIcon;
      case 'Geek':
        return geekIcon;
      case 'Raciste':
        return racisteIcon;
      case 'Urgentiste':
        return urgentisteIcon;
      case 'Prestidigitateur':
        return prestidigitateurIcon;
      case 'Flash Gordon':
        return flashGordonIcon;
      case 'Inépuisable':
        return inépuisableIcon;
      case "Peau d'argent":
        return peauDargentIcon;
      case 'Ingénieur':
        return ingénieurIcon;
      case 'Brute':
        return bruteIcon;
      case 'Rôdeur':
        return rôdeurIcon;
      case "Peau d'acier":
        return peauDacierIcon;
      case 'Éclaireur':
        return éclaireurIcon;
      case 'Je te vois':
        return jeTeVoisIcon;
      case 'Scientifique':
        return scientifiqueIcon;
      case 'Félin':
        return félinIcon;
      case 'Aide de camp':
        return aideDeCampIcon;
      case 'Commando':
        return commandoIcon;
      case 'Ninja':
        return ninjaIcon;
      case 'Polyvalent':
        return polyvalentIcon;
      case "Tireur d'élite":
        return tireurDéliteIcon;
      case 'Oeil de lynx':
        return oeilDeLynxIcon;
      case 'Enragé':
        return enragéIcon;
      default:
        throw new Error(`Unknown implant: ${implant}`);
    }
  }, [implant]);

  return (
    <>
      {!loaded && <Spinner />}
      <img
        src={thumb}
        alt={implant}
        onLoad={() => setLoaded(true)}
        className={`${state === 'ACTIVE' ? styles.active : ''} ${loaded ? styles.visible : styles.hidden}`}
      />
    </>
  );
};
