export interface TabColors {
  cursor: string
  activeText: string
  activeBack: string
  activeBorder: string
 
  passiveText: string
  passiveBack: string
  passiveBorder: string
}
export interface INexiTabsProps {
  tabs: string;
  colors?:string;
  noWhiteSpaceBreak : boolean;
  noBorders: boolean;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}


