import { useSelector } from "react-redux"
import { roleThemes } from "../theme/roleThemes";

export const useRoleTheme = () => {
    const {role} = useSelector((state) => state.auth);
    return roleThemes[role] || roleThemes.ADMIN;
}