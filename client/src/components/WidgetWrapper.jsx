import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
  position: 'relative', // Ensure it's positioned relative to allow absolute children positioning
  overflow: 'visible',
}));

export default WidgetWrapper;
