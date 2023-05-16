import { useState } from 'react';
//dropdown inside sidebar

const SidebarLinkGroup = ({children, activeCondition}) => {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
