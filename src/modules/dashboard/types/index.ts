// Dashboard Module Types

export interface ConfirmationModalData {
  text1: string;
  text2: string;
  btn1Text: string;
  btn2Text: string;
  btn1Handler: () => void;
  btn2Handler: () => void;
}

export interface SidebarLinkProps {
  link: {
    id?: string | number;
    name: string;
    path: string;
    type?: string;
  };
  iconName: string;
  setOpenSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

