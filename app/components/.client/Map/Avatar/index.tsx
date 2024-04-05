import { FC } from "react";
import { PiUserFill } from "react-icons/pi";
import { CustomMarker } from "~/components/.client/Map/CustomMarker";
import { usePositionContext } from "~/contexts/PositionContext";

import styles from "./Avatar.module.css";

export interface AvatarProps {}

export const Avatar: FC<AvatarProps> = () => {
  const position = usePositionContext();

  return (
    <CustomMarker position={position.location}>
      <PiUserFill className={styles.icon} />
    </CustomMarker>
  );
};
