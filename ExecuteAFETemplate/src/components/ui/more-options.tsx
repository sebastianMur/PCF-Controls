import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from "@fluentui/react-components";
import { MoreVerticalRegular } from "@fluentui/react-icons";

type MoreOptionsProps = {
  url?: string;
};

export const MoreOptions = ({ url }: MoreOptionsProps) => {
  const handleGoToAFE = () => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          aria-label="More options"
          appearance="transparent"
          icon={<MoreVerticalRegular />}
        />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem onClick={handleGoToAFE} disabled={!url}>
            Go to AFE Record
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
