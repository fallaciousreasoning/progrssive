import { Theme } from "@material-ui/core";
import { unstable_useMediaQuery } from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/styles";

export const useIsPhone = () => {
    const theme = useTheme() as Theme;
    const query = unstable_useMediaQuery(theme.breakpoints.up('md'));

    return !query.valueOf();
}