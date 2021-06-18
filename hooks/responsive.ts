import { Theme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/styles";

export const useIsPhone = () => {
    const theme = useTheme() as Theme;
    const query = useMediaQuery(theme.breakpoints.up('md'));
    
    if (!theme) return false;

    return !query.valueOf();
}