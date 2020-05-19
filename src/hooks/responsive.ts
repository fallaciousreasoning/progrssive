import { Theme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/styles";

export const useIsPhone = () => {
    const theme = useTheme() as Theme;
    if (!theme) return false;
    const query = useMediaQuery(theme.breakpoints.up('md'));

    return !query.valueOf();
}